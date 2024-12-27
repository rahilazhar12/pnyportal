import React from 'react';
import { Grid, TextField, MenuItem, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const CustomForm = styled('form')({
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

const Personal = ({ setCanProceed, onSubmit, handleSubmit, handleChange, formData }) => {
  const validateForm = () => {
    const allFilled = Object.values(formData).every((x) => {
      const value = String(x).trim();
      return value !== '';
    });
    setCanProceed(allFilled);
  };

  React.useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <>
      <Box sx={{ maxWidth: '1000px', margin: 'auto', mt: 4 }}>
        <CustomForm onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" component="h2" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>

            {/* DOB */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                variant="outlined"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Age */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                variant="outlined"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                variant="outlined"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Transgender">Transgender</MenuItem>
              </TextField>
            </Grid>

            {/* Marital Status */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Marital Status"
                variant="outlined"
                name="martialstatus"
                value={formData.martialstatus}
                onChange={handleChange}
              >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
              </TextField>
            </Grid>

            {/* Father's Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
                variant="outlined"
                name="fathername"
                value={formData.fathername}
                onChange={handleChange}
              />
            </Grid>

            {/* Religion */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Religion"
                variant="outlined"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
              />
            </Grid>

            {/* Mobile Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                variant="outlined"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                helperText="For example +92-311-1234567"
              />
            </Grid>

            {/* Landline Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Landline"
                variant="outlined"
                name="landline"
                value={formData.landline}
                onChange={handleChange}
                helperText="For example +92-1111111111"
              />
            </Grid>

            {/* Postal Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Postal Address"
                variant="outlined"
                name="postaladdress"
                value={formData.postaladdress}
                onChange={handleChange}
              />
            </Grid>

            {/* Domicile */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Domicile"
                variant="outlined"
                name="domicile"
                value={formData.domicile}
                onChange={handleChange}
              />
            </Grid>

            {/* Residential Country */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Residential Country"
                variant="outlined"
                name="ResCountry"
                value={formData.ResCountry}
                onChange={handleChange}
              />
            </Grid>

            {/* Residential City */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Residential City"
                variant="outlined"
                name="ResCity"
                value={formData.ResCity}
                onChange={handleChange}
              />
            </Grid>

            {/* Nationality */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nationality"
                variant="outlined"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </Grid>

            {/* CNIC */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CNIC"
                variant="outlined"
                name="CNIC"
                value={formData.CNIC}
                onChange={handleChange}
                placeholder="35202-0000000-0"
              />
            </Grid>

            {/* CNIC Expiry */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CNIC Expiry"
                variant="outlined"
                type="date"
                name="CNICexpiry"
                value={formData.CNICexpiry}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Hafiz-e-Quran */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Hafiz-e-Quran"
                variant="outlined"
                name="hafizquran"
                value={formData.hafizquran}
                onChange={handleChange}
              >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            {/* Ex-Service Official */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Ex-Service Official"
                variant="outlined"
                name="ExServiceOfficial"
                value={formData.ExServiceOfficial}
                onChange={handleChange}
              >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            {/* Government Official */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Government Official"
                variant="outlined"
                name="Governmentofficial"
                value={formData.Governmentofficial}
                onChange={handleChange}
              >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            {/* Disabled */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Are you Disabled?"
                variant="outlined"
                name="Disabled"
                value={formData.Disabled}
                onChange={handleChange}
              >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            {/* Profile Picture */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                name="profilePicture"
                onChange={handleChange}
                inputProps={{ accept: 'image/png, image/jpeg' }}
              />
            </Grid>         
          </Grid>
        </CustomForm>
      </Box>
    </>
  );
};

export default Personal;
