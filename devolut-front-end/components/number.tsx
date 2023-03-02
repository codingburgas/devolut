import { useSpring, animated } from "react-spring";

export default function Balance({ n }: { n: number }) {
  const { number } = useSpring({
    number: n,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        gap: 4,
      }}
    >
      <animated.div>{number.to((n) => n.toFixed(2))}</animated.div> лв
    </div>
  );
}
