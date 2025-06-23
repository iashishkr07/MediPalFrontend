import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  MedicalServices as MedicalIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Psychology as MentalIcon,
  Bedtime as SleepIcon,
  FitnessCenter as LifestyleIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import API from "../api";

const StyledPaper = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  marginTop: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(4),
  },
  borderRadius: theme.spacing(2),
  boxShadow: "none",
  transition: "transform 0.2s ease-in-out",
  backgroundColor: "rgba(255,255,255,0)",
  backdropFilter: "none",
  border: "none",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    marginBottom: theme.spacing(3),
  },
  color: "rgba(255, 255, 255, 0.9)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontWeight: 600,
  backgroundColor: "rgba(255,255,255,0)",
  fontSize: "1.1rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.25rem",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0)",
    border: "none",
    boxShadow: "none",
    "& fieldset": {
      borderColor: "#222",
    },
    "&:hover fieldset": {
      borderColor: "#111",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
  "& .MuiInputBase-input": {
    color: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(255,255,255,0)",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0)",
    border: "none",
    boxShadow: "none",
    "& fieldset": {
      borderColor: "#222",
    },
    "&:hover fieldset": {
      borderColor: "#111",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
  "& .MuiSelect-select": {
    color: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(255,255,255,0)",
  },
}));

const steps = [
  "Personal Information",
  "Medical History",
  "Emergency Contact",
  "Mental Health",
  "Sleep Assessment",
  "Lifestyle",
];

const AddRecord = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [aadharNo, setAadharNo] = useState("");

  // Function to generate recordId
  const generateRecordId = (userData) => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const userIdentifier = userData?.FullName
      ? userData.FullName.slice(0, 3).toUpperCase()
      : userData?.Phone
      ? userData.Phone.slice(-4)
      : "USER";
    return `${userIdentifier}-${timestamp}-${randomNum}`;
  };

  const initialFormData = {
    recordId: "",
    aadharNo: "",
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    bmi: "",
    bloodPressure: "",
    sugarLevel: "",
    cholesterol: "",
    allergies: "",
    pastSurgeries: "",
    currentMedications: "",
    familyHistory: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    vaccinationHistory: "",
    dietaryRestrictions: "",
    mentalHealth: {
      stressLevel: "",
      anxiety: false,
      depression: false,
    },
    sleepQuality: {
      hoursPerNight: "",
      quality: "",
    },
    lifestyle: {
      smoking: false,
      alcohol: false,
      exercise: false,
      sleep: false,
    },
  };
  const [formData, setFormData] = useState(initialFormData);
  const [expandedSection, setExpandedSection] = useState(null);

  // Add function to check if any lifestyle checkbox is checked
  const isAnyLifestyleChecked = () => {
    return Object.values(formData.lifestyle).some((value) => value === true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to add records");
          return;
        }

        const response = await API.get("/me");

        if (response.data.success) {
          setUserId(response.data.user._id);
          setAadharNo(response.data.user.AadharNo);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user information");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (formData.weight && formData.height) {
      const weightInKg = parseFloat(formData.weight);
      const heightInM = parseFloat(formData.height) / 100;
      const bmi = (weightInKg / (heightInM * heightInM)).toFixed(1);
      setFormData((prev) => ({ ...prev, bmi }));
    }
  }, [formData.weight, formData.height]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name.startsWith("lifestyle.")) {
      const lifestyleField = name.split(".")[1];
      setFormData({
        ...formData,
        lifestyle: {
          ...formData.lifestyle,
          [lifestyleField]: checked,
        },
      });
    } else if (name.startsWith("emergencyContact.")) {
      const contactField = name.split(".")[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [contactField]: value,
        },
      });
    } else if (name.startsWith("mentalHealth.")) {
      const mentalHealthField = name.split(".")[1];
      setFormData({
        ...formData,
        mentalHealth: {
          ...formData.mentalHealth,
          [mentalHealthField]: type === "checkbox" ? checked : value,
        },
      });
    } else if (name.startsWith("sleepQuality.")) {
      const sleepField = name.split(".")[1];
      setFormData({
        ...formData,
        sleepQuality: {
          ...formData.sleepQuality,
          [sleepField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => {
      const nextStep = prevStep + 1;
      // Add motion animation
      const container = document.querySelector(".step-content");
      if (container) {
        container.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => {
          container.style.animation = "slideIn 0.3s ease-in";
        }, 300);
      }
      return nextStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      const prevStepNum = prevStep - 1;
      // Add motion animation
      const container = document.querySelector(".step-content");
      if (container) {
        container.style.animation = "slideOutReverse 0.3s ease-out";
        setTimeout(() => {
          container.style.animation = "slideInReverse 0.3s ease-in";
        }, 300);
      }
      return prevStepNum;
    });
  };

  // Add keyframe animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-100%); opacity: 0; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutReverse {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes slideInReverse {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .step-content {
      transition: all 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug logging for form data
    console.log("Form data before validation:", formData);

    // Validate required fields
    if (!aadharNo) {
      toast.error("Aadhar number is required");
      return;
    }
    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.weight ||
      !formData.height
    ) {
      console.log("Validation failed. Missing fields:", {
        name: !formData.name,
        age: !formData.age,
        gender: !formData.gender,
        weight: !formData.weight,
        height: !formData.height,
      });
      toast.error("Please fill in all required personal information fields");
      return;
    }

    if (
      !formData.bloodPressure ||
      !formData.sugarLevel ||
      !formData.cholesterol ||
      !formData.currentMedications
    ) {
      toast.error("Please fill in all required medical history fields");
      return;
    }

    if (
      !formData.emergencyContact.name ||
      !formData.emergencyContact.relationship ||
      !formData.emergencyContact.phone
    ) {
      toast.error("Please fill in all emergency contact information");
      return;
    }

    if (!formData.mentalHealth.stressLevel) {
      toast.error("Please fill in the stress level field");
      return;
    }

    if (
      !formData.sleepQuality.hoursPerNight ||
      !formData.sleepQuality.quality
    ) {
      toast.error("Please fill in all sleep assessment fields");
      return;
    }

    // Validate lifestyle section
    const lifestyleValues = Object.values(formData.lifestyle);
    if (lifestyleValues.some((value) => value === undefined)) {
      toast.error("Please complete the lifestyle section");
      return;
    }

    if (!isAnyLifestyleChecked()) {
      toast.error("Please select at least one lifestyle option");
      return;
    }

    try {
      // Use stored user data for recordId generation
      const recordId = generateRecordId(userData);

      // Ensure boolean values for mental health checkboxes and include aadharNo
      const submitData = {
        ...formData,
        recordId: recordId,
        aadharNo: aadharNo,
        mentalHealth: {
          ...formData.mentalHealth,
          anxiety: Boolean(formData.mentalHealth.anxiety),
          depression: Boolean(formData.mentalHealth.depression),
        },
        lifestyle: {
          smoking: Boolean(formData.lifestyle.smoking),
          alcohol: Boolean(formData.lifestyle.alcohol),
          exercise: Boolean(formData.lifestyle.exercise),
          sleep: Boolean(formData.lifestyle.sleep),
        },
      };

      // Log the data being sent
      console.log("Submitting data with recordId:", submitData.recordId);
      console.log("Full submit data:", submitData);

      await API.post("/medical-records/create", submitData);

      // Show success toast
      toast.success("Medical record added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form and step
      setFormData(initialFormData);
      setActiveStep(0);
    } catch (error) {
      console.error("Error adding medical record:", error);
      // Show error toast
      toast.error(
        error.response?.data?.message ||
          "Failed to add medical record. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const handleSectionClick = (section) => {
    console.log("Clicking section:", section);
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const SectionHeader = ({ title, icon, section }) => (
    <Box
      onClick={() => handleSectionClick(section)}
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 2,
        p: 2,
        borderRadius: 1,
        backgroundColor: "rgba(255,255,255,0)",
        backdropFilter: "none",
        border: "none",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0)",
        },
      }}
    >
      {icon}
      <Typography variant="h6">{title}</Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {expandedSection === section ? "▼" : "▶"}
      </Typography>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionTitle variant="h6">
                  <PersonIcon /> Personal Information
                </SectionTitle>
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ minWidth: 220 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  label="Age"
                  name="age"
                  type="text"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 120 }}
                  variant="outlined"
                  sx={{ minWidth: 220 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <StyledSelect
                    labelId="gender-label"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                    variant="outlined"
                    sx={{ minWidth: 220 }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="text"
                  value={formData.weight}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 500 }}
                  variant="outlined"
                  sx={{ minWidth: 220 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="text"
                  value={formData.height}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 300 }}
                  variant="outlined"
                  sx={{ minWidth: 220 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="BMI"
                  value={formData.bmi}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated automatically"
                  variant="outlined"
                  sx={{ minWidth: 220 }}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionTitle variant="h6">
                  <HospitalIcon /> Medical History
                </SectionTitle>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Blood Pressure"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="e.g., 120/80"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Sugar Level (mg/dL)"
                  name="sugarLevel"
                  type="number"
                  value={formData.sugarLevel}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 1000 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Cholesterol (mg/dL)"
                  name="cholesterol"
                  type="number"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 1000 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Past Surgeries"
                  name="pastSurgeries"
                  value={formData.pastSurgeries}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  label="Current Medications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Family Medical History"
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="Include any hereditary conditions or family medical history"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Vaccination History"
                  name="vaccinationHistory"
                  value={formData.vaccinationHistory}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="List all vaccinations with dates (e.g., COVID-19 (2021), Flu (2023))"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Dietary Restrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  helperText="List any food allergies, dietary restrictions, or special diets"
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 2:
        return (
          <Fade in={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionTitle variant="h6">
                  <PersonIcon /> Emergency Contact Information
                </SectionTitle>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  fullWidth
                  label="Contact Name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  fullWidth
                  label="Relationship"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 3:
        return (
          <Fade in={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionTitle variant="h6">
                  <MentalIcon /> Mental Health
                </SectionTitle>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Stress Level"
                  name="mentalHealth.stressLevel"
                  value={formData.mentalHealth.stressLevel}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="mentalHealth.anxiety"
                      checked={formData.mentalHealth.anxiety}
                      onChange={handleChange}
                    />
                  }
                  label="Anxiety"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="mentalHealth.depression"
                      checked={formData.mentalHealth.depression}
                      onChange={handleChange}
                    />
                  }
                  label="Depression"
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 4:
        return (
          <Fade in={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionTitle variant="h6">
                  <SleepIcon /> Sleep Assessment
                </SectionTitle>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Hours per Night"
                  name="sleepQuality.hoursPerNight"
                  value={formData.sleepQuality.hoursPerNight}
                  onChange={handleChange}
                  placeholder="e.g., 7"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Sleep Quality"
                  name="sleepQuality.quality"
                  value={formData.sleepQuality.quality}
                  onChange={handleChange}
                  placeholder="e.g., good, bad"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 5:
        return (
          <Fade in={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionTitle variant="h6">
                  <LifestyleIcon /> Lifestyle
                </SectionTitle>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="lifestyle.smoking"
                          checked={formData.lifestyle.smoking}
                          onChange={handleChange}
                        />
                      }
                      label="Smoking"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="lifestyle.alcohol"
                          checked={formData.lifestyle.alcohol}
                          onChange={handleChange}
                        />
                      }
                      label="Alcohol"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="lifestyle.exercise"
                          checked={formData.lifestyle.exercise}
                          onChange={handleChange}
                        />
                      }
                      label="Exercise"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="lifestyle.sleep"
                          checked={formData.lifestyle.sleep}
                          onChange={handleChange}
                        />
                      }
                      label="Sleep"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Fade>
        );
      default:
        return "Unknown step";
    }
  };

  // Inject custom style for responsive stepper
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (min-width: 1023px) and (max-width: 1200px) {
        .responsive-stepper {
          min-width: 850px !important;
        }
        .responsive-stepper .MuiStepLabel-label {
          font-size: 0.9rem !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundColor: "transparent",
        px: { xs: 1, sm: 2, md: 4 },
        overflow: "visible",
      }}
    >
      <ToastContainer />
      <StyledPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Box sx={{ mb: { xs: 2, sm: 4 }, textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <MedicalIcon
                sx={{
                  fontSize: { xs: 32, sm: 48 },
                  color: "rgba(255, 255, 255, 0.9)",
                  mb: 2,
                }}
              />
            </motion.div>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 600,
                fontSize: { xs: "1.5rem", sm: "2.125rem" },
              }}
            >
              Add New Medical Record
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: { xs: "0.95rem", sm: "1.25rem" },
              }}
            >
              Please fill out all required information accurately
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Box
            sx={{
              overflowX: "auto",
              width: "100%",
              minWidth: 0,
              maxWidth: "100vw",
            }}
          >
            <Stepper
              className="responsive-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{
                minWidth: 0,
                width: "100%",
                flexWrap: "wrap",
                mb: { xs: 2, sm: 4 },
                "& .MuiStepLabel-label": {
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: {
                    xs: "0.72rem",
                    sm: "0.85rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                  whiteSpace: "nowrap",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "rgba(255, 255, 255, 0.95)",
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <StepLabel>{label}</StepLabel>
                  </motion.div>
                </Step>
              ))}
            </Stepper>
          </Box>
        </motion.div>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              >
                {getStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "center", sm: "space-between" },
              alignItems: "center",
              mt: 4,
              width: "100%",
              gap: 2,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: "100%", maxWidth: 220 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Back
              </Button>
            </motion.div>

            {activeStep === steps.length - 1 ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: "100%", maxWidth: 300 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<MedicalIcon />}
                  disabled={!isAnyLifestyleChecked()}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Submit Medical Record
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: "100%", maxWidth: 220 }}
              >
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default AddRecord;
