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

const Achievement = ({
  currentachievement,
  onSubmit,
  handleChange,
  handleSubmit,
  handleAddachievement,
  achievements,
  setAchievements,
}) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedAchievement, setEditedAchievement] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedAchievement(achievements[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedAchievement).every(
      (value) => value.trim() !== ""
    );

    if (allFieldsFilled) {
      const updatedAchievements = [...achievements];
      updatedAchievements[editIndex] = editedAchievement;
      setAchievements(updatedAchievements);
      setEditIndex(-1);
      setEditedAchievement({});
    } else {
      alert("Please fill in all fields before saving the changes.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Achievement
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Achievement Title */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Achievement Title"
              name="AchievementTitle"
              fullWidth
              value={
                editIndex === -1
                  ? currentachievement.AchievementTitle
                  : editedAchievement.AchievementTitle
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedAchievement({
                        ...editedAchievement,
                        AchievementTitle: e.target.value,
                      })
              }
              variant="outlined"
            />
          </Grid>

          {/* Achievement Descriptions */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Achievement Descriptions"
              name="AchievementDescriptions"
              fullWidth
              value={
                editIndex === -1
                  ? currentachievement.AchievementDescriptions
                  : editedAchievement.AchievementDescriptions
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedAchievement({
                        ...editedAchievement,
                        AchievementDescriptions: e.target.value,
                      })
              }
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
            onClick={handleAddachievement}
            sx={{ mt: 2 }}
          >
            Add Achievement
          </Button>
        )}
      </div>

      {/* Achievements Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Achievement Title</TableCell>
              <TableCell>Achievement Descriptions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {achievements.length > 0 ? (
              achievements.map((exp, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedAchievement.AchievementTitle}
                        onChange={(e) =>
                          setEditedAchievement({
                            ...editedAchievement,
                            AchievementTitle: e.target.value,
                          })
                        }
                      />
                    ) : (
                      exp.AchievementTitle
                    )}
                  </TableCell>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedAchievement.AchievementDescriptions}
                        onChange={(e) =>
                          setEditedAchievement({
                            ...editedAchievement,
                            AchievementDescriptions: e.target.value,
                          })
                        }
                      />
                    ) : (
                      exp.AchievementDescriptions
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
                <TableCell colSpan={3} align="center">
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

export default Achievement;
