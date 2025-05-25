import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../features/accountSlice";
import { Fragment, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Input,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  // FormControl,
  // FormControlLabel,
  // FormLabel,
  // Radio,
  // RadioGroup,
} from "@mui/material";
import styled from "styled-components";
import { useGuard } from "../hooks/useGuard";
import { getFromLocal, slg2str } from "../helpers/functions";
import { patchRequest, postRequest } from "../models/requests";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DEFAULT_PIC } from "../helpers/config";
import toast from "react-hot-toast";

const StyledContainer = styled.div`
  padding: 1rem;
  min-height: 90dvh;
  .settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & .MuiAvatar-root,
    & #name svg {
      cursor: pointer;
    }

    & #name {
      display: flex;
      gap: 0.1rem;
      align-items: center;
    }

    & #picture {
      display: none;
    }
  }
`;

function Settings() {
  const disptach = useDispatch();
  const { user } = useSelector((store) => store.account);
  const [isEditingName, setIsEditingName] = useState(false);

  async function updateImage(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;

      console.log(file);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateName(e) {
    try {
      e.preventDefault();
      const name = e.target.children[0].children[0].children[0].value.trim();
      if (name === user.name || !name) return;

      console.log(name);
    } catch (err) {
      console.log(err);
    } finally {
      setIsEditingName(false);
    }
  }
  const canRednder = useGuard(user.info_gathered, "/info");
  if (!canRednder) return;

  return (
    <StyledContainer>
      <Typography variant="h5">Settings</Typography>

      <div className="settings">
        <Stack
          display={"flex"}
          direction={"row"}
          gap={".8rem"}
          alignItems={"center"}
          marginBottom={"1rem"}
        >
          <input
            type="file"
            name="picture"
            id="picture"
            accept="image/png, image/jpeg"
            onChange={updateImage}
          />
          <label htmlFor="picture">
            <Avatar src={user.photoURL || DEFAULT_PIC} alt={user.name} />
          </label>
          {isEditingName ? (
            <form onSubmit={updateName}>
              <Stack
                display={"flex"}
                direction={"row"}
                gap={".4rem"}
                alignItems={"center"}
              >
                <Input defaultValue={user.name} style={{ width: "7rem" }} />
                <IconButton type="submit">
                  <Icon icon="ic:baseline-check" width="24" height="24" />
                </IconButton>
                <IconButton
                  type="button"
                  onClick={() => setIsEditingName(false)}
                >
                  <Icon icon="ix:cancel" width="24" height="24" />
                </IconButton>
              </Stack>
            </form>
          ) : (
            <Typography id="name" variant="h6">
              {user.name}
              <Icon
                onClick={() => setIsEditingName(true)}
                icon="iconamoon:edit-bold"
                width="20"
                height="20"
              />
            </Typography>
          )}
        </Stack>

        <TableContainer
          style={{ marginBottom: "1rem" }}
          component={Paper}
          sx={{ maxWidth: 700 }}
        >
          <Table aria-label="simple table">
            <TableBody>
              {Object.entries(user).map(([name, value]) => {
                let betterName = [...name];

                betterName[0] = betterName[0].toUpperCase();
                betterName = betterName.join("").replaceAll("_", " ");

                let betterValue = value;
                if (name === "allergies") return;
                if (typeof value === "string") {
                  if (name !== "email" && name !== "birthdate")
                    betterValue = slg2str(betterValue);
                } else if (typeof value !== "number") return;

                if (typeof betterValue === "number")
                  betterValue = betterValue.toFixed(1);

                return (
                  <TableRow
                    key={name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {betterName}
                    </TableCell>
                    <TableCell align="right">{betterValue || "-"}</TableCell>
                  </TableRow>
                );
              })}

              {/* ///// */}
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Allergies
                </TableCell>
                <TableCell align="right">
                  {user?.allergies?.map((allergy) => {
                    console.log(allergy);
                    let betterName = [...allergy];
                    betterName[0] = betterName[0].toUpperCase();
                    // betterName = betterName.join("").replaceAll("_", " ");

                    return (
                      <Fragment key={allergy}>
                        {betterName}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                        />
                      </Fragment>
                    );
                  })}
                  {!user?.allergies?.length && "-"}
                </TableCell>
              </TableRow>
              {/* ///// */}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack gap={"1rem"} display={"flex"} direction={"row"}>
          <Button
            onClick={() => disptach(logout())}
            variant="outlined"
            color="error"
          >
            Sign out
          </Button>
          <Button
            onClick={async () => {
              const loadingToastId = toast.loading("Loading");
              try {
                const user = await patchRequest("user/update-health-form", {
                  // access_token: getFromLocal("access_token"),
                  info_gathered: false,
                });
                if (user) disptach(login({ user }));
              } catch (err) {
                console.log(err);
              } finally {
                toast.remove(loadingToastId);
              }
            }}
            variant="outlined"
            size="medium"
          >
            Edit your NutriInfo
          </Button>
        </Stack>
      </div>
    </StyledContainer>
  );
}

export default Settings;
