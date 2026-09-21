export type LessonDetail = {
  objectives: string[]; concepts: string[]; explanation: string[]; scenario: string;
  question: string; options: string[]; answer: number; recap: string[];
};

export const lessonDetails: Record<string, LessonDetail> = {
  "KM01-L01": {
    "objectives": [
      "Distinguish learner, facilitator, supervisor and assessor roles.",
      "Recognise when a task or decision sits outside learner authority.",
      "Use the correct reporting path when information is unclear."
    ],
    "concepts": [
      "Learning support explains concepts; it does not authorise practical work.",
      "A workplace supervisor controls practical activity and confirms the approved process.",
      "Formal competence decisions belong to authorised assessors or verifiers.",
      "Professional learners ask for clarification rather than guessing."
    ],
    "explanation": [
      "Diesel-mechanic development combines knowledge, supervised practical skill and workplace experience. These parts support each other, but they are not interchangeable. Knowing how a system works conceptually does not by itself make a learner competent or authorised to work on that system.",
      "Good workplace practice depends on clear roles. The learner prepares, asks questions, follows approved instructions and records work honestly. The supervisor manages the practical environment and confirms what may be done. The facilitator supports learning, while an authorised assessor makes formal competence decisions."
    ],
    "scenario": "A learner receives an instruction that is unclear and appears to involve a system they have not yet worked on. The correct response is to stop, identify what is unclear, and ask the responsible supervisor for clarification before proceeding.",
    "question": "What is the safest professional response when an instruction is unclear or outside your training?",
    "options": [
      "Guess and continue",
      "Ask another learner to decide",
      "Stop and ask the responsible supervisor",
      "Skip the task without reporting it"
    ],
    "answer": 2,
    "recap": [
      "Know your role and the limits of your authority.",
      "Use the approved reporting line when uncertain.",
      "Honest questions and records are part of professional competence."
    ]
  },
  "KM01-L02": {
    "objectives": [
      "Explain hazard and risk in simple terms.",
      "Recognise broad workshop hazard categories.",
      "Use a stop-report-escalate response when conditions are unsafe."
    ],
    "concepts": [
      "A hazard is something with the potential to cause harm.",
      "Risk considers how likely and how serious that harm could be in a situation.",
      "Stored energy, moving equipment, heat, pressure, electricity and chemicals are broad hazard categories.",
      "Safety culture is repeated behaviour, not a once-off checklist."
    ],
    "explanation": [
      "A safe workshop starts with recognition. Learners should notice warning signs, unusual conditions, uncontrolled movement, damaged equipment, spills, stored-energy systems and other broad hazard indicators. Recognition comes before action.",
      "The learner does not need to improvise a technical solution to prove competence. When a situation is unsafe or uncertain, the correct learning behaviour is to stop, protect the area as directed by the workplace, report the concern and escalate it to a competent person."
    ],
    "scenario": "During a supervised activity, a learner notices an unexpected warning indicator and a condition they do not recognise. Rather than continuing, the learner reports the observation and waits for the supervisor to decide the next approved step.",
    "question": "Which sequence best describes a safe learner response to an unfamiliar hazard?",
    "options": [
      "Continue, observe, report later",
      "Stop, report, escalate",
      "Repair, test, document",
      "Ignore it if no one is injured"
    ],
    "answer": 1,
    "recap": [
      "Recognise hazards before acting.",
      "Risk depends on context and potential consequences.",
      "When uncertain, stop and escalate rather than improvise."
    ]
  },
  "KM01-L03": {
    "objectives": [
      "Use clear workplace communication.",
      "Understand why handovers and records matter.",
      "Separate facts, observations and assumptions in communication."
    ],
    "concepts": [
      "Clear communication reduces misunderstanding and rework.",
      "A good handover identifies what was done, what remains and what is uncertain.",
      "Records should distinguish observed facts from assumptions.",
      "Respectful teamwork includes listening, confirming and asking concise questions."
    ],
    "explanation": [
      "Mechanical work is collaborative. A job may pass between learners, supervisors, technicians, stores staff and assessors. If information is vague or missing, the next person can make a poor decision even when the original work was sound.",
      "Useful records are specific and factual. They identify the job or learning activity, relevant observations, decisions made by authorised people and anything still unresolved. A learner should avoid presenting a guess as if it were a confirmed finding."
    ],
    "scenario": "At the end of a supervised learning activity, the learner records the task reference, what was observed, what the supervisor confirmed, and one unresolved point for the next session.",
    "question": "What makes a workplace handover useful?",
    "options": [
      "Only saying the task is finished",
      "Listing facts, status, unresolved points and responsible people",
      "Giving as much technical jargon as possible",
      "Avoiding written records"
    ],
    "answer": 1,
    "recap": [
      "Communicate facts clearly.",
      "Use handovers to preserve status and uncertainty.",
      "Good records support safety, quality and learning."
    ]
  },
  "KM01-L04": {
    "objectives": [
      "Explain why quality and ethics are linked.",
      "Recognise basic environmental responsibilities.",
      "Understand why defects and non-conformances must be reported."
    ],
    "concepts": [
      "Quality means meeting the approved requirement, not merely finishing a task.",
      "Ethical work includes truthful records and reporting defects.",
      "Housekeeping and waste control are part of professional practice.",
      "Hiding mistakes prevents correction and increases risk."
    ],
    "explanation": [
      "Professional workmanship is judged by more than speed. Quality includes following the approved requirement, checking evidence, keeping the work area controlled and reporting anything that does not meet expectations.",
      "Environmental and ethical behaviour are part of the same professional standard. Learners should care for resources, avoid unnecessary waste, keep records truthful and never hide a defect or incomplete task to make work appear finished."
    ],
    "scenario": "A learner notices that a recorded result does not match the approved requirement. Instead of changing the record, the learner flags the difference and asks the supervisor to review it.",
    "question": "What should a learner do when evidence does not match the approved requirement?",
    "options": [
      "Change the record",
      "Hide the result",
      "Report the difference for review",
      "Ignore it if the task looks complete"
    ],
    "answer": 2,
    "recap": [
      "Quality is evidence-based.",
      "Ethics requires truthful reporting.",
      "Environmental care and housekeeping are part of competent work."
    ]
  },
  "KM02-L01": {
    "objectives": [
      "Relate force, motion and energy conceptually.",
      "Explain torque and friction at a high level.",
      "Recognise that mechanical advantage changes how forces are transmitted."
    ],
    "concepts": [
      "Force can change motion or shape.",
      "Torque is a turning effect produced by a force acting at a distance.",
      "Friction resists relative motion and can be useful or wasteful.",
      "Mechanical advantage trades distance or speed for force."
    ],
    "explanation": [
      "Mechanical systems transfer and transform forces. Diesel-mechanic theory uses ideas such as force, motion, torque, friction and energy to explain why components move, resist movement, heat up or transmit power.",
      "These concepts are useful for reasoning, but classroom equations are not workshop settings. Real equipment decisions must use approved specifications and supervised procedures."
    ],
    "scenario": "A longer lever can create a greater turning effect from the same hand force. This illustrates torque and mechanical advantage conceptually, without specifying any workshop tightening value.",
    "question": "What best describes torque?",
    "options": [
      "Electrical resistance",
      "A turning effect",
      "Fluid pressure",
      "Linear speed"
    ],
    "answer": 1,
    "recap": [
      "Force and motion are linked.",
      "Torque describes turning effect.",
      "Theory supports reasoning; approved specifications control real work."
    ]
  },
  "KM02-L02": {
    "objectives": [
      "Use SI units correctly.",
      "Explain why units and tolerances matter.",
      "Recognise the difference between a measurement and an approved limit."
    ],
    "concepts": [
      "A number without the correct unit can be meaningless.",
      "Tolerance describes an acceptable range around a requirement.",
      "Precision and accuracy are related but not identical.",
      "A measured value must be compared with the correct approved specification."
    ],
    "explanation": [
      "Mechanical learning depends on clear measurements. Learners should recognise common SI units, simple conversions, ratios and the need to record values exactly as observed.",
      "A measurement is evidence, not a decision by itself. Whether a value is acceptable depends on the approved source for that component or system. The app therefore teaches reading and calculation concepts without publishing universal workshop limits."
    ],
    "scenario": "Two learners record the same displayed number, but one omits the unit. The record with the unit is more useful because it preserves the meaning of the measurement.",
    "question": "Why must a recorded measurement include its unit?",
    "options": [
      "To make the number look technical",
      "Because the unit gives the value its physical meaning",
      "Only for assessment marks",
      "It is optional if the number is clear"
    ],
    "answer": 1,
    "recap": [
      "Record values with units.",
      "Tolerance belongs to the approved requirement.",
      "Measurement evidence and repair decisions are not the same thing."
    ]
  },
  "KM02-L03": {
    "objectives": [
      "Recognise broad material properties.",
      "Explain why fastener type and material choice matter.",
      "Relate wear to loading, environment and use."
    ],
    "concepts": [
      "Materials differ in strength, hardness, toughness and resistance to heat or corrosion.",
      "Fasteners are selected for specific loads and applications.",
      "Wear is evidence of interaction between surfaces and operating conditions.",
      "Material identification does not authorise heating, cutting or replacement."
    ],
    "explanation": [
      "Vehicle components are made from materials chosen for particular functions. A component may need to resist heat, repeated loading, corrosion, wear or deformation. Understanding these properties helps a learner reason about why parts are designed differently.",
      "Fasteners and joints also form part of the design. Their size, form and material matter, but practical tightening, removal and replacement must always follow approved technical information."
    ],
    "scenario": "A learner compares two sample components and notes that one is designed to resist wear while another is designed to flex. The lesson is about material behaviour, not about changing parts.",
    "question": "Why can two vehicle components use different materials?",
    "options": [
      "Only for appearance",
      "Because different functions require different properties",
      "Because all metals behave the same",
      "To make identification harder"
    ],
    "answer": 1,
    "recap": [
      "Material properties support component function.",
      "Fasteners are part of the engineered system.",
      "Wear observations should be interpreted with approved information."
    ]
  },
  "KM02-L04": {
    "objectives": [
      "Read basic symbols and diagram conventions.",
      "Identify the purpose of labels and technical references.",
      "Explain why approved sources matter."
    ],
    "concepts": [
      "Symbols simplify complex technical information.",
      "A diagram shows relationships, not always physical location.",
      "Labels and references help identify components and circuits.",
      "Unclear information should be checked against the approved source."
    ],
    "explanation": [
      "Technical information allows many people to work from the same controlled reference. Symbols, schematics, part labels and document references reduce ambiguity when they are used correctly.",
      "Learners should practise reading paths, connections and labels conceptually. When a symbol or instruction is unclear, guessing is not acceptable; the correct action is to consult the approved source or ask a competent person."
    ],
    "scenario": "A learner follows a schematic path from a labelled input to an output and explains the relationship without touching a real system.",
    "question": "What should you do when a technical symbol is unclear?",
    "options": [
      "Guess from its shape",
      "Ignore it",
      "Check the approved source or ask a competent person",
      "Use a different system"
    ],
    "answer": 2,
    "recap": [
      "Symbols communicate relationships.",
      "Controlled documents reduce ambiguity.",
      "Unclear information must be verified, not guessed."
    ]
  },
  "KM02-L05": {
    "objectives": [
      "Separate symptoms, causes, evidence and conclusions.",
      "Use structured reasoning instead of guesswork.",
      "Recognise contradictions in evidence."
    ],
    "concepts": [
      "A symptom is what is observed or reported.",
      "A possible cause is a hypothesis, not a confirmed fact.",
      "Evidence supports or weakens a hypothesis.",
      "A conclusion should fit the available evidence and acknowledge uncertainty."
    ],
    "explanation": [
      "Fault reasoning is a disciplined way of thinking. The learner starts with what is known, lists plausible system areas, gathers approved evidence and avoids jumping from one symptom directly to a repair decision.",
      "Good reasoning also notices contradictions. If one observation does not fit the leading explanation, it should not be ignored. The hypothesis may need to change or additional authorised testing may be required."
    ],
    "scenario": "A warning indicator and a driver report point toward one system area, but another observation does not fit. The learner records the contradiction rather than forcing all evidence into one conclusion.",
    "question": "What is a possible cause before it is supported by evidence?",
    "options": [
      "A verified repair",
      "A hypothesis",
      "A specification",
      "A measurement"
    ],
    "answer": 1,
    "recap": [
      "Symptoms are not causes.",
      "Evidence tests hypotheses.",
      "Contradictions are useful diagnostic information."
    ]
  },
  "KM03-L01": {
    "objectives": [
      "Identify the main vehicle system groups.",
      "Explain how systems interact at a high level.",
      "Recognise that one symptom may involve more than one system."
    ],
    "concepts": [
      "Major groups include engine, driveline, braking, steering, suspension, electrical and fluid power.",
      "Systems exchange energy, information and loads.",
      "A fault in one system can influence another.",
      "System recognition is learning support, not repair authority."
    ],
    "explanation": [
      "A vehicle is a network of interacting systems rather than a collection of isolated parts. The engine produces power, the driveline transfers it, the chassis supports loads, and braking, steering and suspension control motion and stability.",
      "Modern vehicles also use electrical, electronic, hydraulic and pneumatic systems to monitor and control functions. Understanding the whole-system picture helps learners avoid narrow thinking."
    ],
    "scenario": "A learner is given a symptom and maps which system groups could reasonably influence it before considering any specific component.",
    "question": "Why is a whole-system view useful?",
    "options": [
      "Because every fault has one obvious cause",
      "Because systems interact and symptoms can cross system boundaries",
      "Because diagrams replace testing",
      "Because all systems use the same components"
    ],
    "answer": 1,
    "recap": [
      "Think in systems before components.",
      "Vehicle systems interact.",
      "A broad map improves later diagnostic reasoning."
    ]
  },
  "KM03-L02": {
    "objectives": [
      "Describe how power moves from engine to driven wheels or equipment.",
      "Explain the role of chassis support.",
      "Recognise the difference between power production and power transfer."
    ],
    "concepts": [
      "The engine produces mechanical power.",
      "Driveline components transfer and adapt that power.",
      "The chassis carries loads and locates major systems.",
      "Power flow can be described conceptually without disassembly."
    ],
    "explanation": [
      "Power begins with the engine but must be transferred through other components before useful motion reaches the road wheels or driven equipment. Driveline elements adapt speed, torque and direction according to the vehicle design.",
      "The chassis provides the structural foundation that supports these systems and carries loads. Understanding these relationships helps explain why a symptom in one area can be felt elsewhere."
    ],
    "scenario": "A learner traces a conceptual power-flow diagram from engine output through the driveline to the final driven element.",
    "question": "Which statement is correct?",
    "options": [
      "The chassis produces engine power",
      "The driveline transfers power produced by the engine",
      "The engine is part of the brake system",
      "Power transfer and power production are identical"
    ],
    "answer": 1,
    "recap": [
      "Engine produces; driveline transfers.",
      "Chassis supports system loads.",
      "Power-flow diagrams support conceptual understanding."
    ]
  },
  "KM03-L03": {
    "objectives": [
      "Explain the purposes of braking, steering and suspension.",
      "Recognise stored-energy and movement hazards conceptually.",
      "Understand how these systems contribute to vehicle control."
    ],
    "concepts": [
      "Brakes reduce or hold vehicle motion.",
      "Steering controls direction.",
      "Suspension supports loads while allowing controlled movement.",
      "These are safety-critical systems requiring approved practical procedures."
    ],
    "explanation": [
      "Braking, steering and suspension directly affect vehicle control. Their components may also contain stored energy or support heavy loads, which makes practical work safety-critical.",
      "The learner should understand system purpose, broad architecture and warning signs. Operational release, support, adjustment and repair remain supervised workplace activities using approved procedures."
    ],
    "scenario": "A classroom diagram shows how braking, steering and suspension each contribute differently to controlling a moving vehicle.",
    "question": "Why are these systems treated as safety-critical?",
    "options": [
      "They are always electronic",
      "They directly affect vehicle control and may involve stored energy or heavy loads",
      "They are only used at high speed",
      "They require no verification"
    ],
    "answer": 1,
    "recap": [
      "Braking, steering and suspension serve different control functions.",
      "Stored energy and load introduce hazards.",
      "Practical work requires approved supervision."
    ]
  },
  "KM03-L04": {
    "objectives": [
      "Recognise basic electrical system roles.",
      "Explain sensor, actuator and controller concepts.",
      "Understand that electrical evidence must be interpreted carefully."
    ],
    "concepts": [
      "Batteries store electrical energy.",
      "Starting and charging systems support engine operation.",
      "Sensors provide information; actuators create a response.",
      "Controllers use inputs and programmed logic to manage outputs."
    ],
    "explanation": [
      "Electrical and electronic systems support starting, charging, lighting, monitoring and control. Modern diesel vehicles also use electronic controllers to combine information from multiple sensors and command actuators.",
      "Learners should understand the information flow without performing live electrical procedures. Actual probing, isolation and component replacement belong to supervised practical work."
    ],
    "scenario": "A learner studies a simple block diagram showing sensor input, controller decision and actuator output.",
    "question": "What is the general role of a sensor?",
    "options": [
      "To provide information about a condition",
      "To store fuel",
      "To transmit mechanical torque",
      "To support the chassis"
    ],
    "answer": 0,
    "recap": [
      "Electrical systems supply and control energy.",
      "Sensors inform; actuators respond.",
      "Live testing remains supervised practical work."
    ]
  },
  "KM03-L05": {
    "objectives": [
      "Explain pressure and flow conceptually.",
      "Recognise basic hydraulic and pneumatic elements.",
      "Understand stored-energy risk."
    ],
    "concepts": [
      "Pressure is force distributed over an area.",
      "Flow describes movement of fluid or air through a system.",
      "Pumps or compressors create system supply; valves control paths; actuators create motion.",
      "Pressurised systems may retain stored energy after shutdown."
    ],
    "explanation": [
      "Hydraulic and pneumatic systems use fluid or compressed air to transmit energy. Their behaviour is described using ideas such as pressure, flow, control valves and actuators.",
      "Because stored energy can remain in a system, practical opening or disconnection is hazardous. The learning goal is to recognise system purpose and evidence, not to teach release procedures."
    ],
    "scenario": "A learner compares a hydraulic diagram and a pneumatic diagram, identifying supply, control and actuator roles without operating either system.",
    "question": "Why can a pressurised system remain hazardous after shutdown?",
    "options": [
      "Because the vehicle is always moving",
      "Because stored energy may remain in the system",
      "Because pressure disappears instantly",
      "Because only electrical systems store energy"
    ],
    "answer": 1,
    "recap": [
      "Pressure and flow describe system behaviour.",
      "Valves and actuators control energy transfer.",
      "Stored energy requires supervised practical control."
    ]
  },
  "KM04-L01": {
    "objectives": [
      "Describe the four-stroke diesel cycle conceptually.",
      "Identify broad engine component roles.",
      "Connect combustion to mechanical output."
    ],
    "concepts": [
      "Intake brings air into the cylinder.",
      "Compression raises air pressure and temperature.",
      "Combustion releases energy that drives the power stroke.",
      "Exhaust removes spent gases before the next cycle."
    ],
    "explanation": [
      "A four-stroke diesel engine converts chemical energy in fuel into mechanical output through repeated intake, compression, power and exhaust events. The cycle depends on coordinated movement of pistons, valves and the crank mechanism.",
      "This lesson focuses on what happens and why. Timing, dismantling and adjustment procedures are intentionally outside the learner-facing app."
    ],
    "scenario": "A learner places the four cycle events in order and explains what changes in the cylinder during each event.",
    "question": "Which event follows compression in the normal four-stroke sequence?",
    "options": [
      "Intake",
      "Power",
      "Exhaust",
      "Cooling"
    ],
    "answer": 1,
    "recap": [
      "The diesel cycle has four repeating events.",
      "Combustion energy becomes mechanical motion.",
      "Conceptual sequence is different from repair procedure."
    ]
  },
  "KM04-L02": {
    "objectives": [
      "Explain why engines need controlled airflow.",
      "Describe turbocharger and charge-air-cooling roles conceptually.",
      "Relate exhaust flow to engine operation."
    ],
    "concepts": [
      "Airflow supplies oxygen for combustion.",
      "A turbocharger uses exhaust energy to increase intake-air supply.",
      "Charge-air cooling can increase air density.",
      "Restrictions or leaks can influence engine performance symptoms."
    ],
    "explanation": [
      "Diesel engines depend on a controlled supply of clean air. Turbocharging uses energy in the exhaust stream to compress incoming air, while charge-air cooling manages the temperature of that compressed air.",
      "The intake and exhaust paths therefore form an interacting system. Learners should understand relationships and symptoms without performing boost testing or mechanical adjustments."
    ],
    "scenario": "A learner studies a diagram showing air entering through filtration, passing through a turbocharger and cooler, then leaving through the exhaust path.",
    "question": "What is the main conceptual purpose of charge-air cooling?",
    "options": [
      "To increase fuel pressure",
      "To reduce the temperature of compressed intake air",
      "To charge the battery",
      "To lubricate the turbocharger"
    ],
    "answer": 1,
    "recap": [
      "Airflow supports combustion.",
      "Turbocharging uses exhaust energy.",
      "Air temperature and density influence engine breathing."
    ]
  },
  "KM04-L03": {
    "objectives": [
      "Describe the fuel path at a high level.",
      "Explain atomisation and combustion conceptually.",
      "Recognise high-pressure fuel systems as hazardous."
    ],
    "concepts": [
      "Fuel is stored, filtered, supplied and metered before combustion.",
      "Injection timing and atomisation influence how fuel burns.",
      "Modern systems may operate at very high pressure.",
      "High-pressure practical work requires approved procedures and competent supervision."
    ],
    "explanation": [
      "The fuel system must deliver clean, correctly controlled fuel so that combustion can occur efficiently. Modern diesel systems use precise electronic control and high-pressure injection to manage delivery.",
      "Because high-pressure fuel can cause severe injury, the app teaches system purpose, terminology and evidence recognition only. It does not provide opening, leak-testing or depressurisation procedures."
    ],
    "scenario": "A learner follows a simplified fuel-system block diagram from storage to combustion and identifies where filtration, control and injection fit conceptually.",
    "question": "Why does the app avoid operational guidance for high-pressure diesel fuel systems?",
    "options": [
      "They are unimportant",
      "They can retain dangerous pressure and require controlled procedures",
      "They are always identical",
      "They do not affect combustion"
    ],
    "answer": 1,
    "recap": [
      "Fuel quality and control influence combustion.",
      "Injection systems can operate at hazardous pressure.",
      "Learn the system; use approved supervision for practical work."
    ]
  },
  "KM04-L04": {
    "objectives": [
      "Explain the purposes of lubrication and cooling.",
      "Describe heat management conceptually.",
      "Recognise contamination and pressure as important considerations."
    ],
    "concepts": [
      "Lubrication reduces friction and carries heat and contaminants.",
      "Cooling controls engine temperature within the designed range.",
      "Both systems depend on flow and component condition.",
      "Hot or pressurised systems require controlled workplace procedures."
    ],
    "explanation": [
      "Lubrication protects moving surfaces by maintaining a film between components, carrying heat and helping manage contamination. Cooling removes excess heat so materials and clearances remain within the engine's intended operating range.",
      "Problems in either system can affect many engine areas. Learners should understand the relationships and recognise warning signs without opening hot or pressurised systems."
    ],
    "scenario": "A learner compares the functions of lubrication and cooling and identifies where both contribute to controlling heat.",
    "question": "Which statement best describes lubrication?",
    "options": [
      "It only changes engine colour",
      "It reduces friction and helps manage heat and contamination",
      "It replaces the cooling system",
      "It increases tyre pressure"
    ],
    "answer": 1,
    "recap": [
      "Lubrication and cooling protect the engine differently.",
      "Both systems help manage heat.",
      "Practical opening of hot or pressurised systems requires supervision."
    ]
  },
  "KM04-L05": {
    "objectives": [
      "Separate engine symptoms from causes.",
      "Organise evidence before conclusions.",
      "Recognise why service history and warning information matter."
    ],
    "concepts": [
      "A symptom is evidence that something has changed.",
      "Multiple causes can produce similar symptoms.",
      "Service history and approved measurements add context.",
      "Repair decisions require controlled diagnosis, not assumption."
    ],
    "explanation": [
      "Engine condition is assessed by combining information rather than relying on one symptom. Driver reports, warning indicators, service history, visual observations and approved measurements can all contribute to the evidence picture.",
      "The learner should practise organising evidence and noting uncertainty. Real diagnostic testing and return-to-service decisions belong to authorised workplace processes."
    ],
    "scenario": "A learner receives a driver complaint and warning indicator, then lists what is known, what is not known and what approved evidence would be useful to a supervisor.",
    "question": "Why is a symptom alone not enough to justify a repair decision?",
    "options": [
      "Symptoms never matter",
      "Different causes can produce similar symptoms",
      "Repairs do not need evidence",
      "Only service history matters"
    ],
    "answer": 1,
    "recap": [
      "Symptoms are starting points.",
      "Combine multiple evidence sources.",
      "Authorised diagnosis controls real repair decisions."
    ]
  },
  "KM05-L01": {
    "objectives": [
      "Trace conceptual driveline power flow.",
      "Explain the roles of transmission and final drive.",
      "Relate torque and speed changes to driveline function."
    ],
    "concepts": [
      "The driveline transfers engine output to the driven wheels or equipment.",
      "Transmissions adapt speed and torque relationships.",
      "Propeller shafts and final drives transmit power between major units.",
      "Alignment and repair remain supervised practical work."
    ],
    "explanation": [
      "The driveline carries mechanical power away from the engine and adapts it for useful vehicle motion. Different components change speed, torque, direction or the path of power.",
      "A learner should be able to trace power flow conceptually and identify major units. Practical removal, alignment and adjustment require approved technical procedures."
    ],
    "scenario": "A learner traces a power-flow diagram from engine output through transmission, shafting and final drive to the driven wheels.",
    "question": "What is the driveline's main role?",
    "options": [
      "Produce fuel",
      "Transfer and adapt engine power",
      "Cool the cab",
      "Charge the battery"
    ],
    "answer": 1,
    "recap": [
      "Driveline transfers power.",
      "Transmissions adapt speed and torque.",
      "Practical alignment and adjustment require approved procedures."
    ]
  },
  "KM05-L02": {
    "objectives": [
      "Explain steering and suspension purposes.",
      "Relate suspension movement to tyre contact and load support.",
      "Recognise geometry as a system relationship."
    ],
    "concepts": [
      "Steering changes vehicle direction.",
      "Suspension supports loads while allowing controlled wheel movement.",
      "Damping controls unwanted oscillation.",
      "Geometry influences stability, tyre behaviour and steering response."
    ],
    "explanation": [
      "Steering and suspension work together to keep the vehicle controllable and the tyres in useful contact with the road. Suspension components support loads, permit movement and manage shocks, while steering converts driver input into direction change.",
      "Geometry describes relationships between components and wheel positions. Learners can study these relationships without carrying out lifting, alignment or adjustment procedures."
    ],
    "scenario": "A learner compares two diagrams showing how suspension movement can change wheel position relative to the vehicle.",
    "question": "What is one main purpose of suspension?",
    "options": [
      "To generate fuel pressure",
      "To support loads while controlling wheel movement",
      "To charge batteries",
      "To cool exhaust gas"
    ],
    "answer": 1,
    "recap": [
      "Steering controls direction.",
      "Suspension supports and controls movement.",
      "Geometry is a relationship, not a universal setting."
    ]
  },
  "KM05-L03": {
    "objectives": [
      "Describe hydraulic and pneumatic brake architecture at a high level.",
      "Explain stored-energy awareness.",
      "Recognise braking as safety-critical."
    ],
    "concepts": [
      "Service brakes slow the vehicle; parking systems hold it stationary.",
      "Hydraulic systems transmit force through fluid.",
      "Pneumatic systems use compressed air and may include stored pressure.",
      "Brake work requires approved procedures and competent supervision."
    ],
    "explanation": [
      "Brake systems convert control input into forces that reduce or hold vehicle motion. Depending on the vehicle, the system may use hydraulic pressure, compressed air, electronic control or combinations of these.",
      "Because braking is safety-critical and may involve stored energy, learner-facing content stays at architecture, terminology and hazard recognition. Release, adjustment and repair procedures are excluded."
    ],
    "scenario": "A learner labels the broad functional blocks of a brake-system diagram and explains where control, energy transmission and actuation occur.",
    "question": "Why is stored-energy awareness important in brake systems?",
    "options": [
      "Stored energy can be released unexpectedly",
      "Brakes contain no energy",
      "Only engines can store energy",
      "It only affects tyres"
    ],
    "answer": 0,
    "recap": [
      "Brakes are safety-critical.",
      "Hydraulic and pneumatic systems transmit control differently.",
      "Stored energy requires controlled practical procedures."
    ]
  },
  "KM05-L04": {
    "objectives": [
      "Explain chassis and body roles.",
      "Recognise interfaces between mounted equipment and the base vehicle.",
      "Understand load and structure conceptually."
    ],
    "concepts": [
      "The chassis carries and distributes vehicle loads.",
      "Body and cab structures attach to the chassis through designed interfaces.",
      "Mounted equipment can change load distribution and operating demands.",
      "Heavy or raised structures introduce movement and crush hazards."
    ],
    "explanation": [
      "The chassis forms the structural foundation for major vehicle systems. Bodywork, cabs and auxiliary equipment must interact with that structure without compromising designed load paths.",
      "Learners should understand where interfaces exist and why condition, mounting and load distribution matter. Practical lifting, supporting and removal remain controlled workplace tasks."
    ],
    "scenario": "A learner studies a vehicle layout and identifies which loads are carried through the chassis and which equipment interfaces depend on secure mounting.",
    "question": "What is a primary role of the chassis?",
    "options": [
      "Store fuel pressure",
      "Carry and distribute structural loads",
      "Generate electrical signals",
      "Cool the intake air"
    ],
    "answer": 1,
    "recap": [
      "Chassis supports major loads.",
      "Mounted equipment changes system demands.",
      "Heavy structures require controlled practical handling."
    ]
  },
  "KM05-L05": {
    "objectives": [
      "Organise propulsion-system symptoms.",
      "Use evidence to identify likely system areas.",
      "Avoid premature component replacement conclusions."
    ],
    "concepts": [
      "Driver reports provide useful context but are not final diagnoses.",
      "Warning information can narrow the system area.",
      "Service history may reveal patterns or recent changes.",
      "Evidence should guide the next authorised diagnostic step."
    ],
    "explanation": [
      "Propulsion symptoms can arise from engine, driveline, control or support systems. Good reasoning keeps several plausible system areas open until evidence rules them in or out.",
      "The learner's role is to organise symptoms and evidence, not to jump directly to a replacement decision. Authorised testing and repair remain workplace responsibilities."
    ],
    "scenario": "A learner creates an evidence table with symptom, possible system area, supporting evidence and unresolved questions for supervisor review.",
    "question": "What should happen before a component is blamed for a propulsion symptom?",
    "options": [
      "Replace it immediately",
      "Collect and compare relevant evidence",
      "Ignore service history",
      "Assume the driver report is the diagnosis"
    ],
    "answer": 1,
    "recap": [
      "Propulsion symptoms can cross systems.",
      "Evidence narrows the possibilities.",
      "Replacement decisions need authorised diagnosis."
    ]
  },
  "KM06-L01": {
    "objectives": [
      "Explain voltage, current and resistance conceptually.",
      "Relate electrical power to circuits.",
      "Recognise conductors and insulators."
    ],
    "concepts": [
      "Voltage represents electrical potential difference.",
      "Current is the flow of electric charge.",
      "Resistance opposes current flow.",
      "Power describes the rate of electrical energy transfer."
    ],
    "explanation": [
      "Electrical theory provides a language for describing circuits. Voltage, current and resistance are related quantities that help explain why circuits behave differently under different conditions.",
      "The app uses these concepts for classroom reasoning only. Live testing, bypassing and probing remain supervised practical activities."
    ],
    "scenario": "A learner compares two simple classroom circuits and explains how changing resistance can affect current conceptually.",
    "question": "Which quantity opposes current flow?",
    "options": [
      "Voltage",
      "Resistance",
      "Power",
      "Frequency"
    ],
    "answer": 1,
    "recap": [
      "Voltage, current and resistance are related.",
      "Power describes energy transfer rate.",
      "Classroom theory does not authorise live testing."
    ]
  },
  "KM06-L02": {
    "objectives": [
      "Describe battery, starter and alternator roles.",
      "Explain charging-system purpose.",
      "Recognise high-current electrical hazards."
    ],
    "concepts": [
      "The battery stores electrical energy.",
      "The starter converts electrical energy into mechanical cranking effort.",
      "The alternator supplies electrical power and replenishes the battery while the engine operates.",
      "Vehicle electrical systems can deliver very high current."
    ],
    "explanation": [
      "Starting and charging systems work together. The battery provides stored energy, the starter uses a large amount of electrical power for cranking, and the charging system restores energy and supports vehicle loads during operation.",
      "Understanding this relationship helps learners interpret symptoms. Practical battery handling, jump-starting and live testing are excluded from the learner-facing app."
    ],
    "scenario": "A learner draws a conceptual energy path from battery to starter during cranking, then from alternator back to the electrical system during operation.",
    "question": "What is the alternator's broad role?",
    "options": [
      "Store diesel fuel",
      "Supply electrical power and replenish the battery",
      "Control steering geometry",
      "Pressurise the cooling system"
    ],
    "answer": 1,
    "recap": [
      "Battery stores energy.",
      "Starter uses electrical energy for cranking.",
      "Alternator supplies and restores electrical energy."
    ]
  },
  "KM06-L03": {
    "objectives": [
      "Explain sensor, actuator and ECU roles.",
      "Describe input-process-output logic.",
      "Recognise that one signal may influence several functions."
    ],
    "concepts": [
      "Sensors measure or detect conditions.",
      "Controllers process inputs according to programmed logic.",
      "Actuators create physical responses.",
      "Modern systems often share information across controllers."
    ],
    "explanation": [
      "Electronic control systems can be understood as information loops. Sensors provide data, a controller interprets that data, and actuators change system behaviour. Feedback may then confirm the result.",
      "Because systems are interconnected, a single signal fault can affect several functions. Learners should therefore reason from evidence rather than replace components by assumption."
    ],
    "scenario": "A learner traces a block diagram from a temperature sensor through a controller to an actuator and identifies where feedback could return.",
    "question": "What is the general role of an actuator?",
    "options": [
      "Store a specification",
      "Create a commanded physical response",
      "Write service history",
      "Measure every system variable"
    ],
    "answer": 1,
    "recap": [
      "Sensors inform.",
      "Controllers decide.",
      "Actuators respond."
    ]
  },
  "KM06-L04": {
    "objectives": [
      "Read wiring symbols and connection paths.",
      "Distinguish logical diagrams from physical layouts.",
      "Explain why approved schematics matter."
    ],
    "concepts": [
      "Wiring diagrams show electrical relationships.",
      "Connector and component labels support traceability.",
      "Grounds and power paths form part of circuit reasoning.",
      "A schematic does not necessarily show physical component position."
    ],
    "explanation": [
      "Wiring diagrams let learners follow electrical paths without touching a live circuit. Symbols, connector references and line conventions represent how components are related electrically.",
      "Approved diagrams are essential because vehicle variants can differ. A learner should never assume that one diagram applies universally."
    ],
    "scenario": "A learner follows a printed circuit path from a supply symbol through a switch and load to ground, identifying each symbol from a legend.",
    "question": "Does a wiring schematic always show the physical location of components?",
    "options": [
      "Yes, exactly",
      "No, it mainly shows electrical relationships",
      "Only for batteries",
      "Only when printed in colour"
    ],
    "answer": 1,
    "recap": [
      "Schematics show relationships.",
      "Labels support traceability.",
      "Use the correct approved diagram for the vehicle or system."
    ]
  },
  "KM06-L05": {
    "objectives": [
      "Explain hydraulic pressure, flow and force relationships.",
      "Recognise pumps, valves and actuators conceptually.",
      "Understand contamination and stored-energy concerns."
    ],
    "concepts": [
      "Pressure acts throughout a contained fluid system.",
      "Flow is necessary for actuator movement.",
      "Valves control direction, pressure or flow.",
      "Contamination can damage precision components."
    ],
    "explanation": [
      "Hydraulic systems use incompressible fluid to transmit energy. Pumps create flow, restrictions and loads influence pressure, valves control paths, and actuators convert fluid energy into motion.",
      "Because hydraulic systems can hold dangerous stored energy, this lesson stays at theory and system recognition. Practical release, hose work and lifting procedures are excluded."
    ],
    "scenario": "A learner identifies pump, valve and actuator symbols in a classroom hydraulic diagram and explains their broad functions.",
    "question": "What does a hydraulic actuator do?",
    "options": [
      "Convert fluid energy into mechanical movement",
      "Store software",
      "Cool exhaust gas",
      "Measure tyre tread"
    ],
    "answer": 0,
    "recap": [
      "Hydraulic systems transmit energy through fluid.",
      "Valves control paths and conditions.",
      "Stored energy and contamination require controlled practical work."
    ]
  },
  "KM06-L06": {
    "objectives": [
      "Explain pneumatic pressure and flow conceptually.",
      "Recognise compressors, reservoirs, valves and actuators.",
      "Understand why compressed air can remain hazardous."
    ],
    "concepts": [
      "Compressors supply compressed air.",
      "Reservoirs store compressed air energy.",
      "Valves control flow and pressure paths.",
      "Actuators convert air pressure into movement."
    ],
    "explanation": [
      "Pneumatic systems use compressed air to transmit and store energy. Air can be generated, stored, controlled and directed to actuators for vehicle functions.",
      "Stored compressed air can release energy suddenly. Learners therefore study architecture, symbols and system purpose without operational draining, releasing or disconnecting instructions."
    ],
    "scenario": "A learner traces a simplified pneumatic path from compressor to reservoir, control valve and actuator.",
    "question": "Why is a pneumatic reservoir important?",
    "options": [
      "It stores compressed air energy",
      "It stores coolant",
      "It generates engine torque",
      "It measures voltage"
    ],
    "answer": 0,
    "recap": [
      "Compressed air stores energy.",
      "Valves control pneumatic paths.",
      "Stored energy requires supervised practical control."
    ]
  },
  "KM07-L01": {
    "objectives": [
      "Explain closed-loop engine management conceptually.",
      "Relate sensor inputs to control strategies.",
      "Recognise adaptive control as evidence-driven adjustment."
    ],
    "concepts": [
      "Controllers compare inputs with expected operating conditions.",
      "Outputs are adjusted through actuators.",
      "Feedback lets the system observe the effect of a command.",
      "Fault logic can protect the engine or limit operation."
    ],
    "explanation": [
      "Advanced engine management coordinates many inputs and outputs at high speed. The controller considers operating conditions, driver demand and system feedback before commanding actuators.",
      "Diagnostic reasoning therefore requires understanding relationships rather than treating each sensor independently. Programming, calibration and live diagnostic procedures remain authorised practical work."
    ],
    "scenario": "A learner maps how an engine controller could use several sensor inputs to manage one output while monitoring feedback.",
    "question": "What is the purpose of feedback in a control loop?",
    "options": [
      "To hide system information",
      "To show whether the commanded response achieved the expected result",
      "To replace all sensors",
      "To increase tyre pressure"
    ],
    "answer": 1,
    "recap": [
      "Engine management is a control loop.",
      "Multiple inputs can influence one output.",
      "Feedback supports control and diagnosis."
    ]
  },
  "KM07-L02": {
    "objectives": [
      "Explain interaction between fuel, air and emissions systems.",
      "Recognise after-treatment as part of the engine system.",
      "Understand why operating condition matters."
    ],
    "concepts": [
      "Combustion quality depends on coordinated fuel and air control.",
      "Exhaust after-treatment manages pollutants after combustion.",
      "Sensors monitor conditions across the system.",
      "Hot exhaust and high-pressure fuel systems remain hazardous."
    ],
    "explanation": [
      "Modern diesel engines treat fuel, air and emissions control as one integrated system. Changes in one area can affect combustion, exhaust temperature and after-treatment performance.",
      "Learners should understand these interactions and the meaning of monitored conditions. Regeneration, high-pressure fuel work and emissions-system servicing are not instructed in the app."
    ],
    "scenario": "A learner follows a conceptual flow from air intake and fuel delivery through combustion to exhaust after-treatment, noting where sensors provide feedback.",
    "question": "Why should fuel, air and after-treatment be considered together?",
    "options": [
      "They operate independently",
      "They interact through combustion and exhaust conditions",
      "Only the fuel system affects emissions",
      "After-treatment has no sensors"
    ],
    "answer": 1,
    "recap": [
      "Fuel, air and emissions systems interact.",
      "Sensors link operating conditions to control decisions.",
      "Hazardous practical work remains supervised."
    ]
  },
  "KM07-L03": {
    "objectives": [
      "Explain electronically controlled braking concepts.",
      "Describe stability assistance at a high level.",
      "Recognise sensor plausibility as a diagnostic idea."
    ],
    "concepts": [
      "Electronic braking can coordinate pressure or braking demand.",
      "Stability systems compare vehicle motion with intended direction.",
      "Wheel-speed and motion sensors provide key information.",
      "Safety-critical control faults require authorised diagnosis."
    ],
    "explanation": [
      "Advanced braking and stability systems combine mechanical or pneumatic braking with electronic monitoring and control. Controllers compare multiple sensor signals to decide whether assistance is needed.",
      "A learner should understand the control logic and how inconsistent signals can affect system behaviour, without performing brake release, pressure or calibration procedures."
    ],
    "scenario": "A learner compares two sensor signals on a classroom graph and identifies that one does not agree with the vehicle-motion context.",
    "question": "What can inconsistent sensor information indicate in an electronic braking system?",
    "options": [
      "Nothing important",
      "A possible signal, sensor or system plausibility issue requiring authorised diagnosis",
      "A guaranteed mechanical failure",
      "That the battery is full"
    ],
    "answer": 1,
    "recap": [
      "Electronic braking combines sensing and control.",
      "Stability assistance compares intended and actual motion.",
      "Signal plausibility matters."
    ]
  },
  "KM07-L04": {
    "objectives": [
      "Explain electronic transmission management.",
      "Relate torque transfer to control decisions.",
      "Recognise interactions between engine and driveline controllers."
    ],
    "concepts": [
      "Modern transmissions can use electronic control for shift decisions.",
      "Engine torque information can influence transmission behaviour.",
      "Sensors monitor speed, position and operating condition.",
      "Control faults can produce symptoms across the driveline."
    ],
    "explanation": [
      "Electronically managed transmissions coordinate mechanical power transfer with sensor information and controller logic. Shift quality and driveline behaviour can depend on information shared with the engine and other systems.",
      "This interaction means a symptom that feels mechanical may have an electronic or communication contribution. Learners should build a system view before drawing conclusions."
    ],
    "scenario": "A learner maps information shared between an engine controller and transmission controller during a conceptual operating change.",
    "question": "Why can a driveline symptom involve more than the transmission itself?",
    "options": [
      "Controllers and systems can share information and torque demands",
      "Transmissions never use electronics",
      "Only tyres affect driveline behaviour",
      "All faults are mechanical"
    ],
    "answer": 0,
    "recap": [
      "Modern transmissions combine mechanical and electronic control.",
      "Controllers can share torque and speed information.",
      "Cross-system evidence matters."
    ]
  },
  "KM07-L05": {
    "objectives": [
      "Explain networked vehicle communication conceptually.",
      "Recognise messages, nodes and shared data.",
      "Understand how communication faults can affect multiple systems."
    ],
    "concepts": [
      "Vehicle controllers exchange information over communication networks.",
      "A controller can both send and receive messages.",
      "One missing signal can affect several dependent systems.",
      "Communication diagnosis requires approved tools and procedures."
    ],
    "explanation": [
      "Networked electronics allow controllers to share information instead of duplicating every sensor. This reduces wiring and enables coordinated control, but also creates new diagnostic relationships.",
      "A communication fault may therefore produce symptoms in several systems. Learners should think in terms of information flow, message availability and dependencies."
    ],
    "scenario": "A learner draws a simple network map showing three controllers sharing one vehicle-speed message.",
    "question": "Why can one communication fault affect several systems?",
    "options": [
      "Because systems may depend on shared network information",
      "Because networks only carry power",
      "Because all controllers are identical",
      "Because communication is unrelated to diagnosis"
    ],
    "answer": 0,
    "recap": [
      "Controllers share data over networks.",
      "Shared information creates dependencies.",
      "Network faults can create multi-system symptoms."
    ]
  },
  "KM07-L06": {
    "objectives": [
      "Explain electronically controlled fluid-power systems.",
      "Relate sensors and valves to hydraulic or pneumatic control.",
      "Recognise feedback and stored-energy considerations."
    ],
    "concepts": [
      "Electronic commands can control valves in fluid-power systems.",
      "Sensors report pressure, position or state.",
      "Controllers compare command and feedback.",
      "Stored hydraulic or pneumatic energy remains a practical hazard."
    ],
    "explanation": [
      "Advanced fluid-power systems combine hydraulic or pneumatic energy with electronic control. A controller may command valves while sensors report the resulting pressure, position or system state.",
      "For learners, the important idea is the information-and-energy loop. Practical pressure release, disconnection and actuator work remain outside the app."
    ],
    "scenario": "A learner follows a conceptual loop from electronic command to valve action, actuator movement and sensor feedback.",
    "question": "What does feedback add to an electronically controlled fluid-power system?",
    "options": [
      "Information about the actual result",
      "More stored fuel",
      "A mechanical gear ratio",
      "A chassis load"
    ],
    "answer": 0,
    "recap": [
      "Electronic control can manage fluid-power valves.",
      "Sensors report actual conditions.",
      "Stored energy remains a supervised practical concern."
    ]
  },
  "KM07-L07": {
    "objectives": [
      "Recognise integrated fault patterns.",
      "Use system interaction maps.",
      "Prioritise evidence that can explain several symptoms at once."
    ],
    "concepts": [
      "One root issue can create symptoms in several systems.",
      "Shared power, grounds, networks or sensor information can link faults.",
      "Coincidence should not be assumed without evidence.",
      "The best hypothesis explains the largest amount of reliable evidence with the fewest unsupported assumptions."
    ],
    "explanation": [
      "Integrated diagnosis looks for relationships between symptoms rather than treating each fault independently. Shared information, electrical supply, operating conditions and mechanical interactions can create patterns.",
      "Learners should practise building and comparing hypotheses. The goal is to organise evidence for authorised testing, not to prescribe repair procedures."
    ],
    "scenario": "A learner sees several warnings appearing together and maps the systems to identify what information or resources they share.",
    "question": "What is a useful first reasoning step when several systems show symptoms together?",
    "options": [
      "Replace one component from each system",
      "Look for shared dependencies and evidence",
      "Ignore the pattern",
      "Assume every symptom is unrelated"
    ],
    "answer": 1,
    "recap": [
      "Multi-system symptoms may share a cause.",
      "Map common dependencies.",
      "Use evidence to compare hypotheses."
    ]
  },
  "KM08-L01": {
    "objectives": [
      "Use a structured fault-isolation sequence.",
      "Define the problem before testing.",
      "Separate facts from assumptions."
    ],
    "concepts": [
      "Problem definition comes before cause selection.",
      "A hypothesis is a testable explanation.",
      "Evidence should change confidence in a hypothesis.",
      "Isolation means narrowing possibilities systematically."
    ],
    "explanation": [
      "Structured problem solving starts by defining the symptom accurately: what happens, under what conditions, and what evidence already exists. Only then should possible causes be organised.",
      "The learner can then compare hypotheses against authorised evidence. Good diagnosis narrows the field step by step instead of jumping directly to a favourite cause."
    ],
    "scenario": "A learner rewrites a vague complaint into a clearer problem statement that identifies the observed symptom and the condition under which it occurs.",
    "question": "What should happen before choosing a likely cause?",
    "options": [
      "Replace a component",
      "Define the problem clearly",
      "Ignore the driver report",
      "Reset every warning"
    ],
    "answer": 1,
    "recap": [
      "Define before diagnosing.",
      "Hypotheses must be tested against evidence.",
      "Isolation narrows possibilities systematically."
    ]
  },
  "KM08-L02": {
    "objectives": [
      "Interpret diagnostic information critically.",
      "Distinguish stored information from confirmed causes.",
      "Use context to judge relevance."
    ],
    "concepts": [
      "Diagnostic codes identify detected conditions, not necessarily failed components.",
      "Freeze-frame or event data can provide operating context.",
      "Live or recorded data must be compared with expected relationships.",
      "Evidence from different sources should be cross-checked."
    ],
    "explanation": [
      "Diagnostic information is valuable when interpreted in context. A code or warning shows what the system detected, but it does not automatically identify the root cause or prescribe a replacement.",
      "Learners should connect diagnostic information with symptoms, operating conditions and system relationships. Tool use and live testing remain supervised practical activities."
    ],
    "scenario": "A learner reviews a fictional diagnostic code and explains three possible reasons the controller might have detected that condition without naming a repair.",
    "question": "What does a diagnostic trouble code usually represent?",
    "options": [
      "A guaranteed failed component",
      "A detected condition that requires interpretation",
      "A repair instruction",
      "A universal specification"
    ],
    "answer": 1,
    "recap": [
      "Codes require interpretation.",
      "Context matters.",
      "Cross-check diagnostic information with other evidence."
    ]
  },
  "KM08-L03": {
    "objectives": [
      "Explain engine performance and efficiency conceptually.",
      "Relate load, airflow, fuel and heat.",
      "Recognise that performance changes can have several causes."
    ],
    "concepts": [
      "Power output depends on controlled combustion and mechanical condition.",
      "Efficiency describes useful output relative to energy input.",
      "Airflow, fuel delivery, friction and temperature all influence performance.",
      "Performance evidence must be interpreted against approved expectations."
    ],
    "explanation": [
      "Engine performance reflects how effectively the system converts fuel energy into useful mechanical output. Air supply, combustion quality, mechanical losses, temperature control and load all influence the result.",
      "Learners should reason about relationships rather than chase a single number. Real performance testing requires approved equipment, procedures and specifications."
    ],
    "scenario": "A learner creates a concept map showing how airflow, fuel control, friction and temperature could each influence overall engine efficiency.",
    "question": "Why can reduced engine performance have several possible causes?",
    "options": [
      "Performance depends on interacting systems",
      "Only fuel matters",
      "Efficiency never changes",
      "All engines use the same settings"
    ],
    "answer": 0,
    "recap": [
      "Performance is multi-factor.",
      "Efficiency relates input energy to useful output.",
      "Approved testing is needed for real conclusions."
    ]
  },
  "KM08-L04": {
    "objectives": [
      "Relate emissions to combustion and operating condition.",
      "Explain reliability as a pattern over time.",
      "Recognise service history as useful evidence."
    ],
    "concepts": [
      "Combustion quality influences emissions.",
      "Operating condition can affect exhaust-system behaviour.",
      "Reliability depends on design, condition, maintenance and use.",
      "Trend information can be more useful than one isolated observation."
    ],
    "explanation": [
      "Emissions and reliability are not isolated topics. Combustion, engine condition, after-treatment, maintenance history and operating conditions can all influence the evidence a technician sees.",
      "Learners should look for patterns over time, especially repeated symptoms, service events and changes in operating condition. This supports better problem definition before authorised testing."
    ],
    "scenario": "A learner compares a single unusual event with a repeated pattern across several service records and explains why the trend deserves more weight.",
    "question": "Why can trend information be useful?",
    "options": [
      "It shows patterns across time rather than one isolated event",
      "It replaces all testing",
      "It guarantees a cause",
      "It makes service history unnecessary"
    ],
    "answer": 0,
    "recap": [
      "Emissions reflect system interaction.",
      "Reliability is observed over time.",
      "Trends can strengthen or weaken diagnostic hypotheses."
    ]
  },
  "KM08-L05": {
    "objectives": [
      "Make evidence-based quality decisions.",
      "Know when to escalate uncertainty.",
      "Present a clear diagnostic evidence record."
    ],
    "concepts": [
      "A good decision states what is known and what remains uncertain.",
      "Escalation is appropriate when evidence is insufficient or authority is limited.",
      "Quality decisions use approved sources and traceable evidence.",
      "Return-to-service decisions belong to authorised competent people."
    ],
    "explanation": [
      "The final stage of problem solving is not simply choosing an answer. It is documenting the evidence, explaining the reasoning, identifying uncertainty and ensuring the right authorised person reviews the decision.",
      "Learners should become comfortable saying that the available evidence is not sufficient. Escalation protects people, equipment and the credibility of the diagnostic process."
    ],
    "scenario": "A learner prepares a short evidence summary with symptom, supporting observations, contradictions, unresolved questions and the supervisor decision still required.",
    "question": "When should a learner escalate a diagnostic issue?",
    "options": [
      "Only after guessing",
      "When evidence is insufficient, contradictory or beyond learner authority",
      "Never",
      "Only when paperwork is complete"
    ],
    "answer": 1,
    "recap": [
      "Document evidence and uncertainty.",
      "Escalation is professional when limits are reached.",
      "Authorised people make final safety-critical decisions."
    ]
  }
};

export const lessonDetailIds = Object.keys(lessonDetails);