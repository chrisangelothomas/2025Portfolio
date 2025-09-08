import KBotImg from '../assets/K-Bot.png';

export default function KBotShowcase() {
  return (
    <div className="relative z-10 mt-[25vh] flex justify-center">
      <img
        src={KBotImg}
        alt="K-Bot"
        className="h-[220vh] w-auto max-w-none object-contain"
      />
    </div>
  );
}


