export const removeAllTokens = () => {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
}