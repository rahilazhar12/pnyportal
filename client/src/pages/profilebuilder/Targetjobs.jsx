import React from "react";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";

const Targetjobs = ({
  onSubmit,
  handleSubmit,
  handleChange,
  formData,
  loading,
}) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Skills
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Job Title */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Title"
              id="JobTitle"
              name="JobTitle"
              fullWidth
              value={formData.JobTitle}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* Career Level */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="CareerLevelLabel">Career Level</InputLabel>
              <Select
                labelId="CareerLevelLabel"
                id="CareerLevel"
                name="CareerLevel"
                value={formData.CareerLevel}
                onChange={handleChange}
                label="Career Level"
              >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Target Monthly Salary */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Target Monthly Salary (PKR)"
              id="TargetMonthlySalary"
              name="TargetMonthlySalary"
              fullWidth
              value={formData.TargetMonthlySalary}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* Last Monthly Salary */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Monthly Salary (PKR)"
              id="LastMonthlySalary"
              name="LastMonthlySalary"
              fullWidth
              value={formData.LastMonthlySalary}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <div className="flex justify-center mt-5">
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}{" "}
            {/* Show loader or text */}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Targetjobs;
