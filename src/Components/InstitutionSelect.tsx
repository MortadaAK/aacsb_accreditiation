import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import useStore from "../Store";
import { EMPTY } from "./Value";

export interface InstitutionRecord {
  name: string;
  address: string;
}
const load = async (count = 0, from = 0, start: InstitutionRecord[] = []) => {
  const { instituionsManager, institution } = useStore.getState();
  if (count === 0) {
    count = (await instituionsManager?.institutionsLength())?.toNumber() || 0;
  }
  const result = (await instituionsManager?.listInstitutions(from)) || [];
  let prepared: InstitutionRecord[] = await Promise.all(
    result
      .filter((address) => address !== EMPTY)
      .map(async (address) => {
        const instituion = await institution(address);
        const name = await instituion.name();
        return { name, address };
      })
  );
  if (prepared.length + start.length < count) {
    const remaining = await load(count, 10, prepared);
    prepared = prepared.concat(remaining);
  }
  return prepared;
};
export default function InstitutionSelect({
  instituion,
  onChange,
}: {
  instituion: InstitutionRecord | null;
  onChange: (selected: InstitutionRecord | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<InstitutionRecord[]>([]);
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
      value={instituion}
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
          label="Select Institution"
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
