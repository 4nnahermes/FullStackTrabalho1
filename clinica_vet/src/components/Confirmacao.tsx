type ConfirmacaoProps = {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    onConfirmar: () => void;
    onCancelar: () => void;
};

export default function Confirmacao({
    aberto,
    titulo,
    mensagem,
    onConfirmar,
    onCancelar
}: ConfirmacaoProps) {

    if (!aberto) {
        return null;
    }

    return (
        <div className="w3-modal" style={{ display: "block" }}>
            <div className="w3-modal-content w3-card-4" style={{ maxWidth: "450px" }}>

                <header className="w3-container menu-verde">
                    <h3>{titulo}</h3>
                </header>

                <div className="w3-container" style={{ padding: "20px" }}>
                    <p>{mensagem}</p>
                </div>

                <footer
                    className="w3-container"
                    style={{
                        padding: "15px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px"
                    }}
                >
                    <button
                        className="w3-button botao-secundario"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        className="w3-button w3-red"
                        onClick={onConfirmar}
                    >
                        Excluir
                    </button>
                </footer>

            </div>
        </div>
    );
}