import { BuilderComponent, builder } from '@builder.io/react';

// Replace with your Public API Key.
builder.init('080513e0d5ae4bf78ed0b86e8ac876c6');

export default function Page() {
  return <BuilderComponent model="symbol" />;
}
