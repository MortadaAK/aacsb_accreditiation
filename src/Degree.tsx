import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
export enum Degree {
  ScholarlyAcademics,
  PracticeAcademics,
  ScholarlyPractitioner,
  InstructionalPractitioner,
}
export const display = (type: any): string => {
  return (
    // @ts-ignore
    {
      [Degree.ScholarlyAcademics]: "Scholarly Academics",
      [Degree.PracticeAcademics]: "Practice Academics",
      [Degree.ScholarlyPractitioner]: "Scholarly Practitioner",
      [Degree.InstructionalPractitioner]: "Instructional Practitioner",
    }[type.toString()] || "Not Found"
  );
};

export const DegreeSelect = ({
  onChange,
  value,
}: {
  value: Degree | null;
  onChange: (degree: Degree) => void;
}) => {
  return (
    <Autocomplete
      value={value}
      fullWidth
      onChange={(_, degree) => {
        degree !== null && onChange(degree);
      }}
      options={[
        Degree.ScholarlyAcademics,
        Degree.PracticeAcademics,
        Degree.ScholarlyPractitioner,
        Degree.InstructionalPractitioner,
      ]}
      getOptionLabel={(option) =>
        ({
          [Degree.InstructionalPractitioner]: "Instructional Practitioner",
          [Degree.PracticeAcademics]: "Practice Academics",
          [Degree.ScholarlyAcademics]: "Scholarly Academics",
          [Degree.ScholarlyPractitioner]: "Scholarly Practitioner",
        }[option])
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Select Degree"
          variant="outlined"
        />
      )}
    />
  );
};
