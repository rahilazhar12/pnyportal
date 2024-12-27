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

const Certification = ({
  currentcertification,
  onSubmit,
  handleChange,
  handleSubmit,
  handleAddcertification,
  certification,
  setCertification,
}) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedCertification, setEditedCertification] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedCertification(certification[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedCertification).every(
      (value) => value.trim() !== ""
    );

    if (allFieldsFilled) {
      const updatedCertification = [...certification];
      updatedCertification[editIndex] = editedCertification;
      setCertification(updatedCertification);
      setEditIndex(-1);
      setEditedCertification({});
    } else {
      alert("Please fill in all fields before saving the changes.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Certification
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Certification */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Certification"
              name="Certification"
              fullWidth
              value={
                editIndex === -1
                  ? currentcertification.Certification
                  : editedCertification.Certification
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedCertification({
                        ...editedCertification,
                        Certification: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>

          {/* Institute */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Institute"
              name="Institutee"
              fullWidth
              value={
                editIndex === -1
                  ? currentcertification.Institutee
                  : editedCertification.Institutee
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedCertification({
                        ...editedCertification,
                        Institutee: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>

          {/* Valid Till */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Valid Till"
              name="ValidTill"
              type="date"
              fullWidth
              value={
                editIndex === -1
                  ? currentcertification.ValidTill
                  : editedCertification.ValidTill
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedCertification({
                        ...editedCertification,
                        ValidTill: e.target.value,
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
            onClick={handleAddcertification}
            sx={{ mt: 2 }}
          >
            Add Certification
          </Button>
        )}
      </div>

      {/* Certification Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Certification</TableCell>
              <TableCell>Institute</TableCell>
              <TableCell>Valid Till</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certification.length > 0 ? (
              certification.map((exp, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedCertification.Certification}
                        onChange={(e) =>
                          setEditedCertification({
                            ...editedCertification,
                            Certification: e.target.value,
                          })
                        }
                      />
                    ) : (
                      exp.Certification
                    )}
                  </TableCell>
                  <TableCell>{exp.Institutee}</TableCell>
                  <TableCell>{exp.ValidTill}</TableCell>
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

export default Certification;
