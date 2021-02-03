export default (app) => {
  app.message(/let['‘’]?s goo+/i, ({ message: { user }, say }) => {
    if (user === "U04SVSAPE") {
      say({
        blocks: [
          {
            type: "image",
            image_url:
              "https://media.giphy.com/media/ibosUA51tvL6c2HZM0/giphy.gif",
            alt_text: "you already said that",
          },
        ],
      });
    }
  });
};
