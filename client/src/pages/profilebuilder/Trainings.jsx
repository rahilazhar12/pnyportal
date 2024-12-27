import React, { useState } from "react";
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
  Container,
} from "@mui/material";

const Trainings = ({
  currenttrainings,
  onSubmit,
  handleChange,
  handleSubmit,
  handleAddtrainings,
  trainings,
  setTrainings,
}) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedTraining, setEditedTraining] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedTraining(trainings[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedTraining).every(
      (value) => value.trim() !== ""
    );

    if (allFieldsFilled) {
      const updatedTrainings = [...trainings];
      updatedTrainings[editIndex] = editedTraining;
      setTrainings(updatedTrainings);
      setEditIndex(-1);
      setEditedTraining({});
    } else {
      alert("Please fill in all fields before saving the changes.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Trainings
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Training */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Training"
              name="Training"
              fullWidth
              value={
                editIndex === -1
                  ? currenttrainings.Training
                  : editedTraining.Training
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedTraining({
                        ...editedTraining,
                        Training: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>

          {/* Institute */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Institute"
              name="Institute"
              fullWidth
              value={
                editIndex === -1
                  ? currenttrainings.Institute
                  : editedTraining.Institute
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedTraining({
                        ...editedTraining,
                        Institute: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>

          {/* From Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="From"
              name="From"
              type="date"
              fullWidth
              value={
                editIndex === -1 ? currenttrainings.From : editedTraining.From
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedTraining({
                        ...editedTraining,
                        From: e.target.value,
                      })
              }
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          {/* To Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="To"
              name="To"
              type="date"
              fullWidth
              value={editIndex === -1 ? currenttrainings.To : editedTraining.To}
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedTraining({
                        ...editedTraining,
                        To: e.target.value,
                      })
              }
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </form>

      <div className="flex justify-center mt-5">
        {editIndex !== -1 ? (
          <div>
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
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddtrainings}
            sx={{ mt: 2 }}
          >
            Add Training
          </Button>
        )}
      </div>

      {/* Trainings Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Training</TableCell>
              <TableCell>Institute</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings.length > 0 ? (
              trainings.map((training, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedTraining.Training}
                        onChange={(e) =>
                          setEditedTraining({
                            ...editedTraining,
                            Training: e.target.value,
                          })
                        }
                      />
                    ) : (
                      training.Training
                    )}
                  </TableCell>
                  <TableCell>{training.Institute}</TableCell>
                  <TableCell>{training.From}</TableCell>
                  <TableCell>{training.To}</TableCell>
                  <TableCell>
                    {index !== editIndex && (
                      <Button
                        color="primary"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No record
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Trainings;
