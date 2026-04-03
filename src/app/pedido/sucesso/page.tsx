import SuccessContent from "./SuccessContent";

export default function PedidoSucessoPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return <SuccessContent sessionId={searchParams.session_id ?? null} />;
}
