import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DigiDb, Conversation, ChatMessage } from '@/lib/db';

// Server-side in-memory session cache as a fallback to guarantee persistence on stateless servers
const memorySessionStore = new Map<string, Conversation>();

// Helper to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Extract email from text
function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

// Extract phone from text
function extractPhone(text: string): string | null {
  const match = text.match(/[6-9]\d{9}/);
  return match ? match[0] : null;
}

// Extract number from message (supporting lakhs, thousands, etc.)
function extractNumber(text: string): number | null {
  const clean = text.toLowerCase();
  const numMatch = clean.match(/\d+([.,]\d+)?/g);
  if (!numMatch) return null;

  let val = parseFloat(numMatch[0].replace(/,/g, ''));
  if (clean.includes('lakh') || clean.includes('లక్ష') || clean.includes(' l ') || clean.includes(' l')) {
    val = val * 100000;
  } else if (clean.includes('cr') || clean.includes('కోటి') || clean.includes('కోట్లు')) {
    val = val * 10000000;
  } else if (clean.includes('k') || clean.includes('వేల') || clean.includes('వేలు')) {
    val = val * 1000;
  }
  return val;
}

// FAQ lookup matching natural questions in English and Telugu
function matchFAQ(text: string, language: 'en' | 'te'): string | null {
  const clean = text.toLowerCase();

  // Documents
  if (clean.includes('document') || clean.includes('paper') || clean.includes('కావాలి') || clean.includes('పత్రాలు') || clean.includes('డాక్యుమెంట్')) {
    return language === 'te'
      ? 'కావలసిన పత్రాలు: 1. పాన్ కార్డ్, 2. ఆధార్ కార్డ్, 3. గత 3 నెలల జీతం స్లిప్స్ లేదా ఐటీఆర్, 4. గత 6 నెలల బ్యాంక్ స్టేట్‌మెంట్.'
      : 'Generally required documents: 1. PAN Card, 2. Aadhaar Card, 3. Last 3 months Salary Slips / ITR, 4. Last 6 months Bank Statement.';
  }

  // Interest Rates
  if (clean.includes('rate') || clean.includes('interest') || clean.includes('వడ్డీ') || clean.includes('పర్సంటేజ్')) {
    return language === 'te'
      ? 'వడ్డీ రేట్లు: హోమ్ లోన్స్ 8.40% నుండి, వ్యక్తిగత (Personal) లోన్స్ 10.50% నుండి, మరియు బిజినెస్ లోన్స్ 12.00% నుండి ప్రారంభమవుతాయి.'
      : 'Our starting interest rates: Home Loans from 8.40%, Personal Loans from 10.50%, and Business Loans from 12.00%.';
  }

  // CIBIL Score
  if (clean.includes('cibil') || clean.includes('score') || clean.includes('సిబిల్') || clean.includes('స్కోర్')) {
    return language === 'te'
      ? 'ఉత్తమ ఆఫర్ల కోసం కనీసం 750 సిబిల్ స్కోర్ ఉండటం మంచిది. కానీ మా వద్ద 650+ స్కోరు ఉన్న వారికి కూడా లోన్ పొందే మార్గాలు ఉన్నాయి.'
      : 'A CIBIL score of 750 or above is ideal. However, we have partner banks that support scores starting from 650+.';
  }

  // Office Location / Contact
  if (clean.includes('address') || clean.includes('branch') || clean.includes('location') || clean.includes('ఆఫీస్') || clean.includes('చిరునామా')) {
    return language === 'te'
      ? 'మా ప్రధాన కార్యాలయం హుజూరాబాద్‌లో ఉంది. Starpowerz Digital Technologies ద్వారా మేం దేశవ్యాప్తంగా సేవలు అందిస్తున్నాం.'
      : 'Our headquarters is located at Huzurabad. As part of Starpowerz Digital Technologies, we consult clients online PAN-India.';
  }

  return null;
}

// State engine flow solver
function getNextMissingStage(conv: Conversation): string {
  if (!conv.customerName) return 'collecting_name';
  if (!conv.loanInterest) return 'collecting_loan_type';
  if (!conv.customerCity) return 'collecting_city';
  if (!conv.employmentType) return 'collecting_employment';
  if (conv.monthlyIncome === undefined || conv.monthlyIncome === null || isNaN(conv.monthlyIncome)) return 'collecting_income';
  if (conv.loanAmount === undefined || conv.loanAmount === null || isNaN(conv.loanAmount)) return 'collecting_amount';
  if (!conv.customerPhone) return 'collecting_phone';
  if (!conv.customerEmail) return 'collecting_email';
  return 'completed';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message, language = 'en' } = body;

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Missing sessionId or message.' }, { status: 400 });
    }

    const client = supabase || null;
    let conv: Conversation | null = null;

    // 1. Fetch conversation state (check Supabase, fallback to memory cache)
    if (client) {
      try {
        const { data } = await client
          .from('conversations')
          .select('*')
          .eq('session_id', sessionId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          conv = {
            id: data.id,
            sessionId: data.session_id,
            customerName: data.customer_name || undefined,
            customerPhone: data.customer_phone || undefined,
            customerEmail: data.customer_email || undefined,
            loanInterest: data.loan_interest || undefined,
            status: data.status,
            assignedTo: data.assigned_to || undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            customerCity: data.customer_city || undefined,
            employmentType: data.employment_type || undefined,
            monthlyIncome: data.monthly_income ? parseFloat(data.monthly_income) : undefined,
            loanAmount: data.loan_amount ? parseFloat(data.loan_amount) : undefined,
            conversationStage: data.conversation_stage || 'collecting_name'
          };
        }
      } catch (err) {
        console.error('Failed to load conversation from Supabase:', err);
      }
    }

    // Fallback to server memory cache
    if (!conv) {
      conv = memorySessionStore.get(sessionId) || null;
    }

    // Provision new conversation if not found
    if (!conv) {
      conv = {
        id: generateUUID(),
        sessionId,
        status: 'active',
        conversationStage: 'collecting_name',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Logging current state before update
    console.log(`[AI Chatbot LOG] Current State for Session ${sessionId}:`, {
      stage: conv.conversationStage,
      name: conv.customerName,
      loanInterest: conv.loanInterest,
      city: conv.customerCity,
      employment: conv.employmentType,
      income: conv.monthlyIncome,
      amount: conv.loanAmount,
      phone: conv.customerPhone,
      email: conv.customerEmail
    });

    // Save user message to database logs
    const userMsg: ChatMessage = {
      id: generateUUID(),
      conversationId: conv.id,
      sender: 'user',
      content: message,
      createdAt: new Date().toISOString()
    };
    if (client) {
      await DigiDb.saveChatMessageAsync(userMsg).catch(() => {});
    }

    const cleanMsg = message.trim();
    const cleanLower = cleanMsg.toLowerCase();

    // 2. Takeover check
    if (cleanLower.includes('human') || cleanLower.includes('agent') || cleanLower.includes('advisor') || cleanLower.includes('వ్యక్తి') || cleanLower.includes('ఆఫీసర్') || cleanLower.includes('ప్రతినిధి')) {
      conv.status = 'assigned';
      conv.conversationStage = 'completed';
      const replyText = language === 'te'
        ? 'నేను మీ అభ్యర్థనను మా లోన్ అడ్వైజర్‌కు బదిలీ చేస్తున్నాను. వారు మీకు త్వరలోనే ఇక్కడ స్పందిస్తారు.'
        : 'Connecting you to a human Advisor. They will take over this thread shortly.';
      
      const botMsg: ChatMessage = {
        id: generateUUID(),
        conversationId: conv.id,
        sender: 'bot',
        content: replyText,
        createdAt: new Date().toISOString()
      };
      if (client) {
        await DigiDb.saveChatMessageAsync(botMsg).catch(() => {});
        await DigiDb.saveConversationAsync(conv).catch(() => {});
      }
      memorySessionStore.set(sessionId, conv);
      return NextResponse.json({ reply: replyText, conversationStatus: conv.status });
    }

    // 3. Entity Extraction from User Message
    const extractedFields: Record<string, any> = {};

    // Extract Phone
    const phone = extractPhone(cleanMsg);
    if (phone && !conv.customerPhone) {
      conv.customerPhone = phone;
      extractedFields.phone = phone;
    }

    // Extract Email
    const email = extractEmail(cleanMsg);
    if (email && !conv.customerEmail) {
      conv.customerEmail = email;
      extractedFields.email = email;
    }

    // Extract Loan Type
    if (!conv.loanInterest) {
      if (cleanLower.includes('personal') || cleanLower.includes('వ్యక్తిగత') || cleanLower.includes('పర్సనల్')) {
        conv.loanInterest = 'Personal Loan';
        extractedFields.loanInterest = 'Personal Loan';
      } else if (cleanLower.includes('home') || cleanLower.includes('హోమ్') || cleanLower.includes('ఇల్లు') || cleanLower.includes('ఇంటి')) {
        conv.loanInterest = 'Home Loan';
        extractedFields.loanInterest = 'Home Loan';
      } else if (cleanLower.includes('business') || cleanLower.includes('వ్యాపార') || cleanLower.includes('బిజినెస్')) {
        conv.loanInterest = 'Business Loan';
        extractedFields.loanInterest = 'Business Loan';
      } else if (cleanLower.includes('education') || cleanLower.includes('చదువు') || cleanLower.includes('విద్య')) {
        conv.loanInterest = 'Education Loan';
        extractedFields.loanInterest = 'Education Loan';
      } else if (cleanLower.includes('vehicle') || cleanLower.includes('car') || cleanLower.includes('బండి') || cleanLower.includes('కార్')) {
        conv.loanInterest = 'Vehicle Loan';
        extractedFields.loanInterest = 'Vehicle Loan';
      } else if (cleanLower.includes('lap') || cleanLower.includes('property') || cleanLower.includes('ఆస్తి')) {
        conv.loanInterest = 'Loan Against Property';
        extractedFields.loanInterest = 'Loan Against Property';
      }
    }

    // Extract numbers based on current active stage
    const currentStage = conv.conversationStage;
    if (currentStage === 'collecting_name') {
      if (cleanMsg.length > 2 && !phone && !email) {
        const nameVal = cleanMsg.replace(/my name is|i am|నేను|నా పేరు/gi, '').trim();
        conv.customerName = nameVal;
        extractedFields.name = nameVal;
      }
    } else if (currentStage === 'collecting_city') {
      if (cleanMsg.length > 2 && !cleanLower.includes('loan') && !cleanLower.includes('income')) {
        conv.customerCity = cleanMsg;
        extractedFields.city = cleanMsg;
      }
    } else if (currentStage === 'collecting_employment') {
      if (cleanLower.includes('salaried') || cleanLower.includes('job') || cleanLower.includes('ఉద్యోగం') || cleanLower.includes('జీతం')) {
        conv.employmentType = 'Salaried';
        extractedFields.employmentType = 'Salaried';
      } else if (cleanLower.includes('self') || cleanLower.includes('business') || cleanLower.includes('సొంత') || cleanLower.includes('వ్యాపారం') || cleanLower.includes('వ్యవసాయం')) {
        conv.employmentType = 'Self-Employed';
        extractedFields.employmentType = 'Self-Employed';
      }
    } else if (currentStage === 'collecting_income') {
      const inc = extractNumber(cleanMsg);
      if (inc) {
        conv.monthlyIncome = inc;
        extractedFields.monthlyIncome = inc;
      }
    } else if (currentStage === 'collecting_amount') {
      const amt = extractNumber(cleanMsg);
      if (amt) {
        conv.loanAmount = amt;
        extractedFields.loanAmount = amt;
      }
    }

    // 4. Update conversation stage dynamically based on missing fields
    const nextStage = getNextMissingStage(conv);
    conv.conversationStage = nextStage;

    // Logging extracted fields and next stage
    console.log(`[AI Chatbot LOG] Extracted Fields:`, extractedFields);
    console.log(`[AI Chatbot LOG] Next Stage: ${nextStage}`);

    // FAQ Interruption check
    const faqReply = matchFAQ(cleanMsg, language);

    // Get the question prompt for the next missing field
    let questionText = '';
    const name = conv.customerName || '';
    const greeting = name ? `${name}, ` : '';

    switch (nextStage) {
      case 'collecting_name':
        questionText = language === 'te'
          ? 'నమస్కారం! నేను మీ డిజి లోన్స్ ఏఐ సహాయకుడిని. మొదట, దయచేసి మీ పూర్తి పేరు చెప్పండి?'
          : 'Hello! I am your DIGI LOANS AI Advisor. To get started, could you please tell me your full name?';
        break;
      case 'collecting_loan_type':
        questionText = language === 'te'
          ? `${greeting}మీకు ఏ రకమైన లోన్ కావాలి? (ఉదాహరణకు: పర్సనల్ లోన్, హోమ్ లోన్, బిజినెస్ లోన్)`
          : `${greeting}what type of loan are you looking for? (e.g. Personal Loan, Home Loan, Business Loan)`;
        break;
      case 'collecting_city':
        questionText = language === 'te'
          ? `${greeting}మీరు ఏ నగరంలో నివసిస్తున్నారు?`
          : `${greeting}which city do you live in?`;
        break;
      case 'collecting_employment':
        questionText = language === 'te'
          ? `${greeting}మీరు ఉద్యోగం చేస్తున్నారా (Salaried) లేదా సొంత వ్యాపారమా (Self-Employed)?`
          : `${greeting}are you currently Salaried or Self-Employed?`;
        break;
      case 'collecting_income':
        questionText = language === 'te'
          ? `${greeting}మీ నెలవారీ నికర ఆదాయం ఎంత?`
          : `${greeting}what is your monthly net income?`;
        break;
      case 'collecting_amount':
        questionText = language === 'te'
          ? `${greeting}మీకు ఎంత లోన్ మొత్తం అవసరం ఉంటుంది?`
          : `${greeting}how much loan amount are you looking to borrow?`;
        break;
      case 'collecting_phone':
        questionText = language === 'te'
          ? `${greeting}మిమ్మల్ని సంప్రదించడానికి మీ 10 అంకెల మొబైల్ నంబర్ చెప్పండి?`
          : `${greeting}what is your 10-digit mobile number so we can reach you?`;
        break;
      case 'collecting_email':
        questionText = language === 'te'
          ? `${greeting}మీకు లోన్ కోట్స్ పంపడానికి మీ ఈమెయిల్ అడ్రస్ చెప్పగలరా?`
          : `${greeting}could you share your email address so we can send you quotes?`;
        break;
    }

    // 5. Build bot response
    let botReply = '';
    if (faqReply) {
      if (questionText) {
        botReply = language === 'te'
          ? `${faqReply}\n\nసరే, తిరిగి లోన్ వివరాల్లోకి వస్తే... ${questionText}`
          : `${faqReply}\n\nAnyway, let's continue... ${questionText}`;
      } else {
        botReply = faqReply;
      }
    } else if (questionText) {
      botReply = questionText;
    } else {
      // Completed!
      botReply = language === 'te'
        ? `ధన్యవాదాలు ${name}! మీ వివరాలన్నీ సమర్పించబడ్డాయి. మా లోన్ అడ్వైజర్ త్వరలోనే మిమ్మల్ని సంప్రదిస్తారు. (అంచనాలు సూచన కొరకు మాత్రమే, ఇది లోన్ అప్రూవల్ కాదు)`
        : `Thank you ${name}! Your details have been submitted. Our expert Advisor will review your profile and contact you shortly. (Disclaimer: Estimates are reference only and do not constitute loan approvals)`;

      // Auto-create lead inside CRM database
      if (client && conv.status !== 'qualified') {
        try {
          const { error: leadErr } = await client
            .from('leads')
            .insert([{
              full_name: conv.customerName,
              mobile_number: conv.customerPhone,
              email: conv.customerEmail || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
              city: conv.customerCity || 'Huzurabad',
              loan_type: conv.loanInterest || 'Personal Loan',
              loan_amount: conv.loanAmount || 100000,
              monthly_income: conv.monthlyIncome || 35000,
              occupation: conv.employmentType || 'Salaried',
              message: `Qualified via Stateful AI Loan Advisor Chatbot. Stage: completed`,
              source: 'Website',
              status: 'New'
            }]);

          if (!leadErr) {
            conv.status = 'qualified';
            console.log(`[AI Chatbot LOG] Lead inserted successfully for ${name}`);
          } else {
            console.error('[AI Chatbot LOG] Lead insert error:', leadErr);
          }
        } catch (err) {
          console.error('[AI Chatbot LOG] Lead creation exception:', err);
        }
      }
    }

    // Save Bot message to database logs
    const botMsg: ChatMessage = {
      id: generateUUID(),
      conversationId: conv.id,
      sender: 'bot',
      content: botReply,
      createdAt: new Date().toISOString()
    };
    if (client) {
      await DigiDb.saveChatMessageAsync(botMsg).catch(() => {});
      await DigiDb.saveConversationAsync(conv)
        .then(() => console.log(`[AI Chatbot LOG] Database updated successfully`))
        .catch(err => console.error(`[AI Chatbot LOG] Database update failed:`, err));
    }

    // Persist in server-side cache
    memorySessionStore.set(sessionId, conv);

    return NextResponse.json({ reply: botReply, conversationStatus: conv.status });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
