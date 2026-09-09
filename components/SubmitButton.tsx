type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SubmitButton({
  children,
  className = "",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
    >
      {children}
    </button>
  );
}