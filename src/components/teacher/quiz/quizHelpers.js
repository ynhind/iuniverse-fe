export const extractList = (payload) => {
  if (Array.isArray(payload))          return payload;
  if (Array.isArray(payload?.data))    return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

export const emptyQuestion = () => ({
  _tempId: `q-${Date.now()}-${Math.random()}`,
  content:    "",
  type:       "MULTIPLE_CHOICE",
  correctAns: "",
  points:     1,
  options:    ["", ""],
});
