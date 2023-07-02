import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import LinearProgress from "@mui/material/LinearProgress";

import React, { useEffect, useState } from "react";

const Captcha = ({ title, onContinue, open, onCancel }) => {
  const [progress, setProgress] = React.useState(0);
  const [randomNumber, setRandomNumber] = useState(0);
  const [clickedNumberButtom, setClickedNumberButtom] = useState();

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 36) + 1);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (open && progress > 0) {
      setTimeout(() => {
        if (open) {
          setProgress(progress - 10);
        } else {
          setProgress(0);
        }
      }, 700);
    }
    // eslint-disable-next-line
  }, [progress]);

  useEffect(() => {
    if (randomNumber !== 0) {
      // eslint-disable-next-line
      if (randomNumber == clickedNumberButtom?.slice(4)) {
        onContinue();
      } else {
        setProgress(100);
        setRandomNumber(Math.floor(Math.random() * 36));
      }
    }
    // eslint-disable-next-line
  }, [clickedNumberButtom]);

  return (
    <>
      <Dialog
        fullWidth={true}
        open={open}
        // open={true}
        PaperProps={{
          style: {
            maxWidth: "740px",
            backgroundColor: "#070908",
            boxShadow: 24,
          },
        }}
        aria-labelledby="alert-dialog-title"
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Apple Color Emoji",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "25px",
            color: "white",
            fontStyle: "italic",
            background:
              "radial-gradient(circle, rgba(24,97,49,1) 43%, rgba(43,57,45,1) 100%)",
            padding: "15px",
          }}
        >
          {title} {randomNumber}
        </Typography>
        <Box
          sx={{
            margin: " 0 auto",
            width: "700px",
            marginTop: "5px",
            padding: "20px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 150"
            version="1.1"
            id="svg2308"
          >
            <g id="layer1">
              <rect
                id="rect3239"
                width="400"
                style={{
                  fill: "#1a6a36",
                }}
                height="150"
                x="1.1368684e-13"
                y="1.4210855e-14"
              />
              <rect
                x="355.53607"
                y="99.177452"
                fill="#ff0000"
                width="27.093561"
                height="31.690153"
                id="Num_34"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="355.53607"
                y="67.531006"
                width="27.093561"
                height="31.646442"
                id="Num_35"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />

              <rect
                x="355.53607"
                y="35.840847"
                fill="#ff0000"
                width="27.093561"
                height="31.693007"
                id="Num_36"
                onClick={(e) => {
                  setClickedNumberButtom(e, "id");
                }}
              />

              <rect
                x="328.44351"
                y="99.177452"
                width="27.091547"
                height="31.690153"
                id="Num_31"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="328.44351"
                y="67.531006"
                fill="#ff0000"
                width="27.091547"
                height="31.646442"
                id="Num_32"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="328.44351"
                y="35.840847"
                width="27.091547"
                height="31.693007"
                id="Num_33"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="301.34995"
                y="99.177452"
                fill="#ff0000"
                width="27.093561"
                height="31.690153"
                id="Num_28"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="301.34995"
                y="67.531006"
                width="27.093561"
                height="31.646442"
                id="Num_29"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="301.34995"
                y="35.840847"
                fill="#ff0000"
                width="27.093561"
                height="31.693007"
                id="Num_30"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="274.25839"
                y="99.177452"
                fill="#ff0000"
                width="27.091547"
                height="31.690153"
                id="Num_25"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="274.25839"
                y="67.531006"
                width="27.091547"
                height="31.646442"
                id="Num_26"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="274.25839"
                y="35.840847"
                fill="#ff0000"
                width="27.091547"
                height="31.693007"
                id="Num_27"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="247.15582"
                y="99.177452"
                width="27.103628"
                height="31.690153"
                id="Num_22"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="247.15582"
                y="67.531006"
                fill="#ff0000"
                width="27.103628"
                height="31.646442"
                id="Num_23"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="247.15582"
                y="35.840847"
                width="27.103628"
                height="31.693007"
                id="Num_24"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="219.97968"
                y="99.177452"
                width="27.176102"
                height="31.690153"
                id="Num_19"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="219.97968"
                y="67.531006"
                width="27.176102"
                height="31.646442"
                id="Num_20"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="219.97968"
                y="35.840847"
                fill="#ff0000"
                width="27.176102"
                height="31.693007"
                id="Num_21"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="192.88614"
                y="99.177452"
                fill="#ff0000"
                width="27.093561"
                height="31.690153"
                id="Num_16"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="192.88614"
                y="67.531006"
                width="27.093561"
                height="31.646442"
                id="Num_17"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="192.88614"
                y="35.840847"
                fill="#ff0000"
                width="27.093561"
                height="31.693007"
                id="Num_18"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="165.79358"
                y="99.177452"
                width="27.091547"
                height="31.690153"
                id="Num_13"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="165.79358"
                y="67.531006"
                fill="#ff0000"
                width="27.091547"
                height="31.646442"
                id="Num_14"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="165.79358"
                y="35.840847"
                width="27.091547"
                height="31.693007"
                id="Num_15"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="138.70102"
                y="99.177452"
                width="27.093561"
                height="31.690153"
                id="Num_10"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="138.70102"
                y="67.531006"
                width="27.093561"
                height="31.646442"
                id="Num_11"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="138.70102"
                y="35.840847"
                fill="#ff0000"
                width="27.093561"
                height="31.693007"
                id="Num_12"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="111.60748"
                y="99.177452"
                fill="#ff0000"
                width="27.093561"
                height="31.690153"
                id="Num_07"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="111.60748"
                y="67.531006"
                width="27.093561"
                height="31.646442"
                id="Num_08"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="111.60748"
                y="35.840847"
                fill="#ff0000"
                width="27.093561"
                height="31.693007"
                id="Num_09"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="84.514915"
                y="99.177452"
                width="27.092554"
                height="31.690153"
                id="Num_04"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="84.514915"
                y="67.531006"
                fill="#ff0000"
                width="27.092554"
                height="31.646442"
                id="Num_05"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="84.514915"
                y="35.840847"
                width="27.092554"
                height="31.693007"
                id="Num_06"
                onClick={(e) => {
                  setClickedNumberButtom("NUMERO:", e.target.id);
                }}
              />
              <rect
                x="57.412304"
                y="99.177452"
                fill="#ff0000"
                width="27.102619"
                height="31.690153"
                id="Num_1"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="57.412304"
                y="67.531006"
                width="27.102619"
                height="31.646442"
                id="Num_2"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              />
              <rect
                x="57.412304"
                y="35.840847"
                fill="#ff0000"
                width="27.102619"
                height="31.693007"
                id="Num_03"
              />
              <polygon
                fill="none"
                stroke="#ffffff"
                points="245.919,105.469 219.004,105.469 192.079,105.469 192.079,72.12 192.079,38.817 192.079,5.468 219.004,5.468 245.919,5.468 272.835,5.468 299.75,5.468 326.665,5.468 353.581,5.468 380.579,5.468 407.504,5.468 434.418,5.468 461.334,5.468 488.249,5.468 515.165,5.468 542.079,5.468 542.079,38.817 542.079,72.12 542.079,105.469 515.165,105.469 488.249,105.469 461.334,105.469 434.418,105.469 407.504,105.469 380.579,105.469 353.581,105.469 326.665,105.469 299.75,105.469 272.835,105.469 "
                id="polygon1732"
                transform="matrix(0.92919239,0,0,0.95025801,-121.06606,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="192.079,72.12 219.004,72.12 245.919,72.12 272.835,72.12 299.75,72.12        326.665,72.12 353.581,72.12 380.579,72.12 407.504,72.12 434.418,72.12 461.334,72.12 488.249,72.12 515.165,72.12        542.079,72.12      "
                id="polyline1734"
                transform="matrix(0.93068879,0,0,0.95025801,-121.35347,30.797178)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="192.079,38.817 219.004,38.817 245.919,38.817 272.835,38.817 299.75,38.817        326.665,38.817 353.581,38.817 380.579,38.817 407.504,38.817 434.418,38.817 461.334,38.817 488.249,38.817 515.165,38.817        542.079,38.817      "
                id="polyline1736"
                transform="matrix(0.92748693,0,0,0.95025801,-120.73847,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="515.165,5.468 515.165,38.817 515.165,72.12 515.165,105.469      "
                id="polyline1738"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="488.249,5.468 488.249,38.817 488.249,72.12 488.249,105.469      "
                id="polyline1740"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="461.334,5.468 461.334,38.817 461.334,72.12 461.334,105.469      "
                id="polyline1742"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="434.418,5.468 434.418,38.817 434.418,72.12 434.418,105.469      "
                id="polyline1744"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="407.504,5.468 407.504,38.817 407.504,72.12 407.504,105.469      "
                id="polyline1746"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="380.579,5.468 380.579,38.817 380.579,72.12 380.579,105.469      "
                id="polyline1748"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="353.581,5.468 353.581,38.817 353.581,72.12 353.581,105.469      "
                id="polyline1750"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="326.665,5.468 326.665,38.817 326.665,72.12 326.665,105.469      "
                id="polyline1752"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="299.75,5.468 299.75,38.817 299.75,72.12 299.75,105.469      "
                id="polyline1754"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="272.835,5.468 272.835,38.817 272.835,72.12 272.835,105.469      "
                id="polyline1756"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="245.919,5.468 245.919,38.817 245.919,72.12 245.919,105.469      "
                id="polyline1758"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <polyline
                fill="none"
                stroke="#ffffff"
                points="219.004,5.468 219.004,38.817 219.004,72.12 219.004,105.469      "
                id="polyline1760"
                transform="matrix(1.0065968,0,0,0.95025801,-135.93382,30.644833)"
              />
              <path
                fill="none"
                stroke="#ffffff"
                d="m 57.355925,130.86664 c -6.857941,0 -13.715892,0 -20.573834,0 L 30.177814,82.403483 36.782091,35.840845 c 6.857942,0 13.715893,0 20.573834,0"
                id="path1794"
              />
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_01"
                x="-122.75529"
                y="73.159187"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                1
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_00"
                x="-90.436661"
                style={{
                  fill: "white",
                }}
                y="47.657078"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                0
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_02"
                x="-90.436661"
                y="73.159187"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                2
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_03"
                x="-57.495228"
                y="73.159187"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                3
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_04"
                x="-122.75529"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                y="100.21909"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                4
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_06"
                x="-57.495243"
                y="100.21909"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                6
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_05"
                x="-90.436661"
                y="100.21909"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                5
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_07"
                x="-122.75529"
                y="126.07173"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                7
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_08"
                x="-90.436661"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                y="126.07173"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                8
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_09"
                x="-57.495243"
                y="126.07173"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                9
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_10"
                x="-127.10671"
                y="152.15352"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                10
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_12"
                x="-61.84861"
                y="152.15352"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                12
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_11"
                x="-94.789955"
                y="152.15352"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                11
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_13"
                x="-127.10671"
                y="179.20003"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                13
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_14"
                x="-94.789955"
                y="179.20003"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                14
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_15"
                x="-61.84861"
                y="179.20003"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                15
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_16"
                x="-127.10671"
                y="205.2829"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                16
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_18"
                x="-61.84861"
                y="205.2829"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                18
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_17"
                x="-94.789955"
                y="205.2829"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                17
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_19"
                x="-127.10671"
                y="231.67793"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                19
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_20"
                x="-94.789955"
                y="231.67793"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                20
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_21"
                x="-61.84861"
                y="231.67793"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                21
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_22"
                x="-127.10671"
                y="257.76077"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                22
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_24"
                x="-61.84861"
                y="257.76077"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                24
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_23"
                x="-94.789955"
                y="257.76077"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                23
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_25"
                x="-127.10671"
                y="284.58948"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                25
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_28"
                x="-94.789955"
                y="284.59048"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                26
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_27"
                x="-61.84861"
                y="284.58948"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                27
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_28"
                x="-127.10671"
                y="310.67236"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                28
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_30"
                x="-61.84861"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                y="310.67236"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                30
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_29"
                x="-94.789955"
                y="310.67331"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                29
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_31"
                x="-127.10671"
                y="336.63004"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                31
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_32"
                x="-94.789955"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                y="336.63101"
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                32
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_33"
                x="-61.84861"
                y="336.63004"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                33
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_34"
                x="-127.10671"
                y="362.71283"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                34
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_36"
                x="-61.84861"
                y="362.71283"
                style={{
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                36
              </text>
              <text
                transform="matrix(0,-0.97161229,1.0292171,0,0,0)"
                id="Num_35"
                x="-94.789955"
                y="362.71378"
                style={{
                  fill: "white",
                  cursor: "default",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  setClickedNumberButtom(e.target.id);
                }}
              >
                35
              </text>
            </g>
          </svg>
        </Box>
        {onCancel && (
          <Button
            variant="outlined"
            sx={{
              color: "white",
              marginLeft: "auto",
              marginBottom: "5px",
              marginRight: "5px",
            }}
            onClick={() => {
              onCancel();
              setTimeout(() => {
                setRandomNumber(Math.floor(Math.random() * 36) + 1);
              }, 500);
            }}
          >
            Cancelar
          </Button>
        )}
      </Dialog>

      <Dialog
        sx={{ backgroundColor: "black" }}
        PaperProps={{
          style: {
            maxWidth: "500px",

            backgroundColor: "#d32f2f",
            boxShadow: 24,
          },
        }}
        open={open && progress > 0}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ErrorOutlineRoundedIcon
            sx={{ marginRight: "-15px", color: "white" }}
          />
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "600",
              textTransform: "uppercase",
              color: "white",
            }}
            id="alert-dialog-title"
          >
            Clickeaste mal el número indicado
          </DialogTitle>
        </Box>
        <DialogContent>
          <DialogContentText
            sx={{
              textAlign: "center",
              fontWeight: "400",
              marginBottom: "15px",
              color: "white",
            }}
            id="alert-dialog-description"
          >
            Por favor prestá atención, para poder autorizar el ticket tenes que
            seleccionar el número correcto.
          </DialogContentText>
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              sx={{ color: "black" }}
              variant="buffer"
              value={progress}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Captcha;
