import ZBotImg from '../assets/Z-Bot.png';

export default function ZBotShowcase() {
  return (
    <div className="relative z-10 mt-[40vh] flex justify-center">
      <img
        src={ZBotImg}
        alt="Z-Bot"
        className="h-[130vh] w-auto max-w-none object-contain"
      />
    </div>
  );
}


