import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from "docker-manager-web/utils/axios";
import {API_GET_PROFILE, API_LOGIN} from 'docker-manager-web/constant/url'

type UserStateType = {
  loginLoading: boolean
  user?: {
    username: string,
    role: string,
    route: {
      code: string,
      name: string,
    }
  },
  error: string
}

const initialState: UserStateType = {
  loginLoading: false,
  user: undefined,
  error: '',
};

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, thunkAPI) => {

    try {
      const res = await axiosClient(API_GET_PROFILE, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: { username: string; password: string }, thunkAPI) => {

    try {
      const res = await axiosClient(API_LOGIN, {
        method: 'POST',
        data: {
          username: credentials.username,
          password: credentials.password,
        },
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
      state.loginLoading = true
    })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loginLoading = false
      })
      .addCase(getUserProfile.pending, (state) => {})
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = {
          username: action.payload.name,
          role: action.payload.role,
          route: {
            code: action.payload.route.code,
            name: action.payload.route.name,
          },
        }
        state.error = ''
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.user = undefined
        state.error = 'unauthorized'
      })
  }
});

// export const { increment, decrement } = userSlice.actions;
export default userSlice.reducer;
