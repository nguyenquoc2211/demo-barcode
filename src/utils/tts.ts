export const speak = (text: string) => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  synth.speak(utter);
};