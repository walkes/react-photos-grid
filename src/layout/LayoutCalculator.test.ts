import LayoutCalculator from "./LayoutCalculator";
import {otherPhotos, somePhotos} from "./LayoutCalculatorFixture";

it("should split photos in rows", () => {
  // given
  const layoutCalculator = new LayoutCalculator(somePhotos.slice(0, 4), 500, 1400);

  // expect
  expect(layoutCalculator.calculate().map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg", "2.jpg"],
    ["3.jpg", "4.jpg"],
  ]);
});

it("should split photos in rows 4", () => {
  // given
  const layoutCalculator = new LayoutCalculator(somePhotos, 180, 900);

  // expect
  expect(layoutCalculator.calculate().map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg", "2.jpg", "3.jpg"],
    ["4.jpg", "5.jpg", "6.jpg"],
    ["7.jpg", "8.jpg"],
    ["9.jpg", "10.jpg"],
  ]);
});

it("should place one photo in each row if viewport width is smaller than photo width", () => {
  // given
  const layoutCalculator = new LayoutCalculator(somePhotos, 180, 50);

  // expect
  expect(layoutCalculator.calculate().map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg"],
    ["2.jpg"],
    ["3.jpg"],
    ["4.jpg"],
    ["5.jpg"],
    ["6.jpg"],
    ["7.jpg"],
    ["8.jpg"],
    ["9.jpg"],
    ["10.jpg"],
  ]);
});

it("should put all pictures in one row if viewport width allows that", () => {
  // given
  const layoutCalculator = new LayoutCalculator(somePhotos,
    somePhotos.map((photo) => photo.height).reduce((a, b) => Math.max(a, b), 0),
    somePhotos.map((photo) => photo.width).reduce((a, b) => a + b, 0));

  // expect
  expect(layoutCalculator.calculate().map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg"],
  ]);
});

it("should put pictures in evenly distributed rows", () => {
  // given
  const layoutCalculator = new LayoutCalculator(otherPhotos, 250, 800);

  // expect
  expect(layoutCalculator.calculate().map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg", "2.jpg"],
    ["3.jpg", "4.jpg", "5.jpg"],
    ["6.jpg", "7.jpg", "8.jpg"],
    ["9.jpg", "10.jpg"],
    ["11.jpg", "12.jpg", "13.jpg"],
    ["14.jpg", "15.jpg", "16.jpg"],
    ["17.jpg", "18.jpg", "19.jpg"],
    ["20.jpg", "21.jpg"],
  ]);

});

it("don't exceed optimal height for one photo", () => {
  // given
  const optimalHeight = 180;
  const layoutCalculator = new LayoutCalculator(somePhotos.slice(0, 1), optimalHeight, 900);

  // expect
  const actual = layoutCalculator.calculate();
  // and all pictures in one row
  expect(actual.map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg"],
  ]);
  // and all pictures has optimal height
  expect(actual.map((row) => row.photos.map((photo) => photo.scaledHeight))).toEqual(
    [[optimalHeight]],
  );
});

it("keep photos in one row if there are too few of them", () => {
  // given
  const optimalHeight = 180;
  const layoutCalculator = new LayoutCalculator(somePhotos.slice(0, 3), optimalHeight, 900);

  // expect
  const actual = layoutCalculator.calculate();
  // and all pictures in one row
  expect(actual.map((row) => row.photos.map((photo) => photo.src))).toEqual([
    ["1.jpg", "2.jpg", "3.jpg"],
  ]);
  // and all pictures has optimal height
  expect(actual.map((row) => row.photos.map((photo) => photo.scaledHeight))).toEqual(
    [Array(3).fill(optimalHeight)],
  );
});
