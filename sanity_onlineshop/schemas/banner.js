export default {
  name: "banner",
  title: "Banner",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "description", title: "Description", type: "string" },
    { name: "buttonText", title: "Button Text", type: "string" },
    { name: "imgSrc", title: "Image", type: "image" },
    { name: "imgWidth", title: "Image Width", type: "number" },
    { name: "imgHeight", title: "Image Height", type: "number" },
    { name: "numberOfDiscountDate", title: "Discount Countdown (days)", type: "number" },
    { name: "href", title: "Link", type: "string" },
  ],
};
