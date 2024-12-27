import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container
} from '@mui/material';

function Academics({ currentacademics, onSubmit, handleChange, handleSubmit, handleAddacademics, academics, setAcademics }) {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedAcademics, setEditedAcademics] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedAcademics(academics[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedAcademics).every((value) => value.trim() !== '');
    if (allFieldsFilled) {
      const updatedAcademics = [...academics];
      updatedAcademics[editIndex] = editedAcademics;
      setAcademics(updatedAcademics);
      setEditIndex(-1);
      setEditedAcademics({});
    } else {
      alert('Please fill in all fields before saving the changes.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Academic Information
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Degree Level */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Degree Level"
              name="degreeLevel"
              fullWidth
              value={editIndex === -1 ? currentacademics.degreeLevel : editedAcademics.degreeLevel}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, degreeLevel: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Degree */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Degree"
              name="degree"
              fullWidth
              value={editIndex === -1 ? currentacademics.degree : editedAcademics.degree}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, degree: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Institute */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Institute"
              name="institute"
              fullWidth
              value={editIndex === -1 ? currentacademics.institute : editedAcademics.institute}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, institute: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Major Subjects */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Major Subjects"
              name="majorsubjects"
              fullWidth
              value={editIndex === -1 ? currentacademics.majorsubjects : editedAcademics.majorsubjects}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, majorsubjects: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              name="startdate"
              type="date"
              fullWidth
              value={editIndex === -1 ? currentacademics.startdate : editedAcademics.startdate}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, startdate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          {/* Completion Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Completion Date"
              name="completiondate"
              type="date"
              fullWidth
              value={editIndex === -1 ? currentacademics.completiondate : editedAcademics.completiondate}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, completiondate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              name="Country"
              fullWidth
              value={editIndex === -1 ? currentacademics.Country : editedAcademics.Country}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, Country: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Marks Percentage */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Marks Percentage"
              name="markspercentage"
              fullWidth
              value={editIndex === -1 ? currentacademics.markspercentage : editedAcademics.markspercentage}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, markspercentage: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Position Holder */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Position Holder"
              name="positionholder"
              fullWidth
              value={editIndex === -1 ? currentacademics.positionholder : editedAcademics.positionholder}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, positionholder: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {/* Grading Criteria */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Grading Criteria"
              name="gradingcriteria"
              fullWidth
              value={editIndex === -1 ? currentacademics.gradingcriteria : editedAcademics.gradingcriteria}
              onChange={editIndex === -1 ? handleChange : (e) => setEditedAcademics({ ...editedAcademics, gradingcriteria: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {editIndex !== -1 ? (
            <Grid item xs={12} className="col-span-4 mt-6 flex justify-center">
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                Save Changes
              </Button>
              <Button variant="contained" color="secondary" onClick={() => setEditIndex(-1)}>
                Cancel
              </Button>
            </Grid>
          ) : (
            <Grid item xs={12} className="col-span-4 mt-6 flex justify-center">
              <Button variant="contained" color="primary" onClick={handleAddacademics}>
                Add Academics
              </Button>
            </Grid>
          )}
        </Grid>
      </form>

      {/* Table for displaying academics */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Degree Level</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Institute</TableCell>
              <TableCell>Major Subjects</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Completion Date</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Marks Percentage</TableCell>
              <TableCell>Position Holder</TableCell>
              <TableCell>Grading Criteria</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {academics.length > 0 ? (
              academics.map((academic, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedAcademics.degreeLevel}
                        onChange={(e) => setEditedAcademics({ ...editedAcademics, degreeLevel: e.target.value })}
                      />
                    ) : (
                      academic.degreeLevel
                    )}
                  </TableCell>
                  <TableCell>{academic.degree}</TableCell>
                  <TableCell>{academic.institute}</TableCell>
                  <TableCell>{academic.majorsubjects}</TableCell>
                  <TableCell>{academic.startdate}</TableCell>
                  <TableCell>{academic.completiondate}</TableCell>
                  <TableCell>{academic.Country}</TableCell>
                  <TableCell>{academic.markspercentage}</TableCell>
                  <TableCell>{academic.positionholder}</TableCell>
                  <TableCell>{academic.gradingcriteria}</TableCell>
                  <TableCell>
                    {index !== editIndex && (
                      <Button color="primary" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No record
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Academics;
