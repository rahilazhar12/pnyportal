import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
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

const Skills = ({
  currentskills,
  onSubmit,
  handleChange,
  handleSubmit,
  handleAddskills,
  skills,
  setSkills,
}) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedSkill, setEditedSkill] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedSkill(skills[index]);
  };

  const handleSave = () => {
    const allFieldsFilled = Object.values(editedSkill).every(
      (value) => value.trim() !== ""
    );

    if (allFieldsFilled) {
      const updatedSkills = [...skills];
      updatedSkills[editIndex] = editedSkill;
      setSkills(updatedSkills);
      setEditIndex(-1);
      setEditedSkill({});
    } else {
      alert("Please fill in all fields before saving the changes.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Skills
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Skill */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skill"
              name="Skill"
              fullWidth
              value={editIndex === -1 ? currentskills.Skill : editedSkill.Skill}
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) => setEditedSkill({ ...editedSkill, Skill: e.target.value })
              }
              variant="outlined"
            />
          </Grid>

          {/* Skill Level */}
          <Grid item xs={12} sm={6}>
            <Select
              label="Skill Level"
              name="SkillLevel"
              fullWidth
              value={
                editIndex === -1
                  ? currentskills.SkillLevel || "Beginner" // Default to "Beginner"
                  : editedSkill.SkillLevel
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedSkill({
                        ...editedSkill,
                        SkillLevel: e.target.value,
                      })
              }
              variant="outlined"
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </Select>
          </Grid>

          {/* Skill Summary */}
          <Grid item xs={12}>
            <TextField
              label="Skill Summary"
              name="SkillSummary"
              multiline
              rows={3}
              fullWidth
              value={
                editIndex === -1
                  ? currentskills.SkillSummary
                  : editedSkill.SkillSummary
              }
              onChange={
                editIndex === -1
                  ? handleChange
                  : (e) =>
                      setEditedSkill({
                        ...editedSkill,
                        SkillSummary: e.target.value,
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
            onClick={handleAddskills}
            sx={{ mt: 2 }}
          >
            Add Skill
          </Button>
        )}
      </div>

      {/* Skills Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Skill</TableCell>
              <TableCell>Skill Level</TableCell>
              <TableCell>Skill Summary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index === editIndex ? (
                      <TextField
                        value={editedSkill.Skill}
                        onChange={(e) =>
                          setEditedSkill({ ...editedSkill, Skill: e.target.value })
                        }
                      />
                    ) : (
                      skill.Skill
                    )}
                  </TableCell>
                  <TableCell>{skill.SkillLevel}</TableCell>
                  <TableCell>{skill.SkillSummary}</TableCell>
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

export default Skills;
