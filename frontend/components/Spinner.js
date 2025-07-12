import { PulseLoader } from 'react-spinners';

export default function Spinner({ color = '#14b8a6', size = 12 }) {
  return (
    <div className="flex justify-center items-center min-h-[100px]">
      <PulseLoader color={color} size={size} />
    </div>
  );
}
