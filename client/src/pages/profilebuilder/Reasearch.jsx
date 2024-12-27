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

const Research = ({
  currentresearch,
  onSubmit,
  handleChange,
  handleSubmit,
  handleAddresearch,
  research,
  setResearch,
}) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedResearch, setEditedResearch] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedResearch(research[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedResearch).every(
      (value) => value.trim() !== ""
    );

    if (allFieldsFilled) {
      const updatedResearch = [...research];
      updatedResearch[editIndex] = editedResearch;
      setResearch(updatedResearch);
      setEditIndex(-1);
      setEditedResearch({});
    } else {
      alert("Please fill in all fields before saving the changes.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Research
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Research Title */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Research Title"
              name="ResearchTitle"
              fullWidth
              value={
                editIndex === -1
                  ? currentresearch.ResearchTitle
                  : editedResearch.ResearchTitle
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedResearch({
                        ...editedResearch,
                        ResearchTitle: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>

          {/* Publication Venue */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Publication Venue"
              name="PublicationVenue"
              fullWidth
              value={
                editIndex === -1
                  ? currentresearch.PublicationVenue
                  : editedResearch.PublicationVenue
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedResearch({
                        ...editedResearch,
                        PublicationVenue: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Publication Link */}
        <TextField
          label="Publication Link"
          name="PublicationLink"
          fullWidth
          multiline
          rows={3}
          value={
            editIndex === -1
              ? currentresearch.PublicationLink
              : editedResearch.PublicationLink
          }
          onChange={
            editIndex === -1
              ? handleChange
              : (e) =>
                  setEditedResearch({
                    ...editedResearch,
                    PublicationLink: e.target.value,
                  })
          }
          variant="outlined"
          sx={{ mt: 2 }}
        />
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
            onClick={handleAddresearch}
            sx={{ mt: 2 }}
          >
            Add Research
          </Button>
        )}
      </div>

      {/* Research Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Research Title</TableCell>
              <TableCell>Publication Venue</TableCell>
              <TableCell>Publication Link</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {research.length > 0 ? (
              research.map((exp, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedResearch.ResearchTitle}
                        onChange={(e) =>
                          setEditedResearch({
                            ...editedResearch,
                            ResearchTitle: e.target.value,
                          })
                        }
                      />
                    ) : (
                      exp.ResearchTitle
                    )}
                  </TableCell>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedResearch.PublicationVenue}
                        onChange={(e) =>
                          setEditedResearch({
                            ...editedResearch,
                            PublicationVenue: e.target.value,
                          })
                        }
                      />
                    ) : (
                      exp.PublicationVenue
                    )}
                  </TableCell>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedResearch.PublicationLink}
                        onChange={(e) =>
                          setEditedResearch({
                            ...editedResearch,
                            PublicationLink: e.target.value,
                          })
                        }
                      />
                    ) : (
                      exp.PublicationLink
                    )}
                  </TableCell>
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
                <TableCell colSpan={4} align="center">
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

export default Research;
