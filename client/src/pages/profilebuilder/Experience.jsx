import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const Experience = ({
  experience,
  setExperiences,
  handleChange,
  handleSubmit,
  handleAddExperience,
  experiences,
}) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedExperience, setEditedExperience] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedExperience(experiences[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedExperience).every(
      (value) => value.trim() !== ''
    );

    if (allFieldsFilled) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editIndex] = editedExperience;
      setExperiences(updatedExperiences);
      setEditIndex(-1);
      setEditedExperience({});
    } else {
      alert('Please fill in all fields before saving the changes.');
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: 'auto', mt: 4 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Experience
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Position Title"
              variant="outlined"
              name="positionTitle"
              value={editIndex === -1 ? experience.positionTitle : editedExperience.positionTitle}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="From"
              variant="outlined"
              type="date"
              name="from"
              value={editIndex === -1 ? experience.from : editedExperience.from}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="To"
              variant="outlined"
              type="date"
              name="to"
              value={editIndex === -1 ? experience.to : editedExperience.to}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              name="companyName"
              value={editIndex === -1 ? experience.companyName : editedExperience.companyName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Level"
              variant="outlined"
              name="jobLevel"
              value={editIndex === -1 ? experience.jobLevel : editedExperience.jobLevel}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Responsibilities"
              variant="outlined"
              name="jobResponsibilities"
              multiline
              rows={3}
              value={editIndex === -1 ? experience.jobResponsibilities : editedExperience.jobResponsibilities}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>

      {editIndex !== -1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mr: 2 }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEditIndex(-1)}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExperience}
          >
            Add Experience
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ mt: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Position Title</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Job Level</TableCell>
              <TableCell>Job Responsibilities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiences.map((exp, index) => (
              <TableRow key={index}>
                <TableCell>
                  {index === editIndex ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editedExperience.positionTitle}
                      onChange={(e) => setEditedExperience({ ...editedExperience, positionTitle: e.target.value })}
                    />
                  ) : (
                    exp.positionTitle
                  )}
                </TableCell>
                <TableCell>
                  {index === editIndex ? (
                    <TextField
                      fullWidth
                      type="date"
                      variant="outlined"
                      value={editedExperience.from}
                      onChange={(e) => setEditedExperience({ ...editedExperience, from: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    exp.from
                  )}
                </TableCell>
                <TableCell>
                  {index === editIndex ? (
                    <TextField
                      fullWidth
                      type="date"
                      variant="outlined"
                      value={editedExperience.to}
                      onChange={(e) => setEditedExperience({ ...editedExperience, to: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    exp.to
                  )}
                </TableCell>
                <TableCell>
                  {index === editIndex ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editedExperience.companyName}
                      onChange={(e) => setEditedExperience({ ...editedExperience, companyName: e.target.value })}
                    />
                  ) : (
                    exp.companyName
                  )}
                </TableCell>
                <TableCell>
                  {index === editIndex ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editedExperience.jobLevel}
                      onChange={(e) => setEditedExperience({ ...editedExperience, jobLevel: e.target.value })}
                    />
                  ) : (
                    exp.jobLevel
                  )}
                </TableCell>
                <TableCell>
                  {index === editIndex ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      value={editedExperience.jobResponsibilities}
                      onChange={(e) => setEditedExperience({ ...editedExperience, jobResponsibilities: e.target.value })}
                    />
                  ) : (
                    exp.jobResponsibilities
                  )}
                </TableCell>
                <TableCell>
                  {index !== editIndex && (
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Experience;
