import React from 'react';
import {FitBox, Group, Paint, rect, RoundedRect, rrect, Shadow} from "@shopify/react-native-skia";
import {theme} from "../../styles/theme";

const src = rect(0, 0, 24, 24);
const border = rrect(src, 5, 5);
const container = rrect(rect(1,1, 22, 22), 5, 5);
interface ButtonProps {
  x: number;
  y: number;
  size: number;
}

function RecordButton({ x, y, size }: ButtonProps) {
  return (
    <FitBox src={src} dst={rect(x, y, size, size)}>
      <Group>
        <Paint>
          <Shadow dx={1} dy={1} blur={3} color={'rgba(174, 174, 192, 0.4)'}/>
        </Paint>
        <RoundedRect rect={border} color={theme.background.primary}/>
      </Group>
      <Group>
        <RoundedRect rect={container} color={theme.sation.primary}/>
      </Group>
    </FitBox>
  );
}

export default RecordButton;
