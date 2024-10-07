import { createSlice ,PayloadAction } from "@reduxjs/toolkit";
import { User, UserProfile } from "../../types/userTypes";

interface InitialState {
    user: UserProfile | null
}

const initialState : InitialState = {
    user: null
}

const userSlice = createSlice({
      name:"user",
      initialState,
      reducers : {
        setUser : (state , action:PayloadAction<UserProfile>) => {
            state.user = action.payload;
        },

        removeUser : (state) => {
            state.user = null
        }
      }

})


export const {setUser , removeUser} = userSlice.actions;
export default userSlice;