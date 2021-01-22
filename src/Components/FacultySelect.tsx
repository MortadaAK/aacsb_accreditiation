import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import useStore from "../Store";
import { EMPTY } from "./Value";

export interface FacultyRecord {
  name: string;
  address: string;
}
const load = async (count = 0, from = 0, start: FacultyRecord[] = []) => {
  const { facultiesManager, faculty: facultyLoader } = useStore.getState();
  if (count === 0) {
    count = (await facultiesManager?.facultiesLength())?.toNumber() || 0;
  }
  const result = (await facultiesManager?.listFaculties(from)) || [];
  let prepared: FacultyRecord[] = await Promise.all(
    result
      .filter((address) => address !== EMPTY)
      .map(async (address) => {
        const faculty = await facultyLoader(address);
        const name = await faculty.name();
        return { name, address };
      })
  );
  if (prepared.length + start.length < count) {
    const remaining = await load(count, 10, prepared);
    prepared = prepared.concat(remaining);
  }
  return prepared;
};
export default function FacultySelect({
  faculty,
  onChange,
}: {
  faculty: FacultyRecord | null;
  onChange: (selected: FacultyRecord | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<FacultyRecord[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const result = await load();

      if (active) {
        setOptions(result);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      fullWidth
      value={faculty}
      onChange={(_, selected) => onChange(selected)}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Select Faculty"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
