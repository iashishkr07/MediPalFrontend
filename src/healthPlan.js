export function generateHealthReport(record) {
  const parseFloatSafe = (val) => parseFloat(val) || 0;
  const bmi = parseFloatSafe(record.bmi);
  const sugar = parseFloatSafe(record.sugarLevel);
  const cholesterol = parseFloatSafe(record.cholesterol);
  const [sysBP, diaBP] = (record.bloodPressure || "0/0")
    .split("/")
    .map(parseFloatSafe);
  const stressLevel = (record.mentalHealth?.stressLevel || "").toLowerCase();
  const sleepHours = parseFloatSafe(record.sleepQuality?.hoursPerNight);
  const exercise = record.lifestyle?.exercise;
  const isVeg = (record.dietaryRestrictions || "")
    .toLowerCase()
    .includes("vegetarian");

  const flags = {
    high: {
      bp: sysBP > 130 || diaBP > 85,
      sugar: sugar > 140,
      chol: cholesterol > 200,
      bmi: bmi >= 25,
    },
    low: {
      bp: sysBP < 90 || diaBP < 60,
      sugar: sugar < 70,
      chol: cholesterol < 125,
      bmi: bmi < 18.5,
    },
    poorSleep: sleepHours < 6,
    stressed:
      stressLevel === "high" ||
      record.mentalHealth?.anxiety ||
      record.mentalHealth?.depression,
  };

  const buildDiet = () => {
    const base = isVeg
      ? {
          morning: "Oats porridge, almonds, green tea",
          lunch: "Roti, dal, sabzi, salad, curd",
        }
      : {
          morning: "Boiled eggs, oats, green tea",
          lunch: "Grilled chicken, brown rice, veggies, curd",
        };
    const evening =
      flags.high.sugar || flags.low.sugar
        ? "Fruit with nuts, green tea"
        : "Fruit, green tea";
    const dinner = flags.high.bmi
      ? "Veg soup + salad (low carb)"
      : "Khichdi + curd + veg sabzi";
    const week = {};
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => {
      week[day] = { ...base, evening, dinner };
    });
    return week;
  };

  const precautions = [];
  const avoid = [
    "Fried and oily food",
    "Sugary drinks",
    "White bread",
    "Excessive salt",
    "Alcohol and smoking",
    "Stressful late-night activities",
  ];
  const actions = [];
  const medicines = [];

  if (flags.high.bp) {
    precautions.push(
      "Reduce salt intake, avoid processed food, include spinach and banana."
    );
    actions.push("Monitor BP weekly, include beetroot juice and yoga.");
    medicines.push("Amlodipine or Telmisartan (doctor-prescribed)");
    avoid.push("Processed and salty snacks");
  }
  if (flags.low.bp) {
    precautions.push(
      "Increase fluid intake and salt. Stay hydrated and avoid long standing."
    );
    actions.push("Drink salted water or ORS. Avoid sudden standing.");
    medicines.push("Fludrocortisone (only under medical supervision)");
  }
  if (flags.high.sugar) {
    precautions.push(
      "Avoid sugar, white rice, sweetened beverages. Eat fiber-rich foods."
    );
    actions.push("Eat small frequent meals. Avoid sugar, monitor after meals.");
    medicines.push("Metformin (doctor-prescribed), Bitter gourd juice");
    avoid.push("Sweets, pastries, sugary cereals");
  }
  if (flags.low.sugar) {
    precautions.push("Do not skip meals. Keep glucose or juice handy.");
    actions.push(
      "Eat carbs every 3 hours. Monitor blood sugar after activity."
    );
    medicines.push("Glucose tablets, fresh fruit juice");
    avoid.push("Skipping meals or fasting for long periods");
  }
  if (flags.high.chol) {
    precautions.push(
      "Avoid red meat, fried food, butter. Eat oats, nuts, and garlic."
    );
    actions.push("Eat omega-3 rich food, cut out fried food.");
    medicines.push("Atorvastatin (doctor-prescribed)");
    avoid.push("Butter, full-fat dairy, red meat");
  }
  if (flags.low.chol) {
    precautions.push(
      "Include healthy fats like avocado, nuts, eggs, and olive oil."
    );
    avoid.push("Fat-free crash diets");
  }
  if (flags.poorSleep) {
    precautions.push(
      "Avoid caffeine in evening, reduce screen time before bed."
    );
    actions.push("Go to bed at the same time daily, create a bedtime routine.");
    medicines.push("Melatonin, chamomile tea");
  }
  if (flags.stressed) {
    precautions.push(
      "Try meditation, journaling, talking to someone you trust."
    );
    actions.push("Try meditation, breathing exercises, limit social media.");
    medicines.push("Ashwagandha, Magnesium, Vitamin B Complex");
  }
  if (flags.high.bmi) {
    precautions.push(
      "Avoid sugary snacks, processed carbs, and late-night meals."
    );
    actions.push("Follow a calorie-deficit diet and walk 30 mins daily.");
  }
  if (flags.low.bmi) {
    precautions.push(
      "Eat calorie-dense meals. Add dairy, nuts, banana shakes, peanut butter."
    );
    actions.push("Eat more protein, healthy fats and do strength training.");
    medicines.push("Appetite stimulants or protein powder (consult doctor)");
  }

  return {
    dietPlan: buildDiet(),
    precautions,
    avoid: [...new Set(avoid)],
    actions,
    medicines,
  };
}
