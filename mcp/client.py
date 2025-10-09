import os
import sys
import requests
from datetime import date
from typing import TypedDict, cast


class ScheduleEntry(TypedDict):
    horario: str
    acessivel: str
    tabela: int


class ControlPoint(TypedDict):
    postoControle: str
    horarios: list[ScheduleEntry]


API_BASE_URL = os.getenv("ETUFOR_API_BASE_URL")

if API_BASE_URL is None:
    print('Erro: A variável de ambiente "ETUFOR_API_BASE_URL" não foi definida.')
    sys.exit(1)


# --- API Client Function ---
def get_line_schedule(
    line_number: str,
    query_date: date | None = None,
) -> list[ControlPoint]:
    """
    Fetches the schedule for a specific bus line.

    Args:
        line_number: The bus line identifier (e.g., "210").
        query_date: The date for the schedule query. Defaults to today.

    Returns:
        A dictionary with the API response or an empty dict on error.
    """

    if query_date is None:
        query_date = date.today()

    formatted_date = query_date.strftime("%Y%m%d")
    url_path = f"{API_BASE_URL}/{line_number}"
    query_params = {"data": formatted_date}

    print(f"Consultando URL: {url_path} com parâmetros: {query_params}")

    try:
        response = requests.get(url_path, params=query_params)
        response.raise_for_status()
        return cast(list[ControlPoint], response.json())
    except requests.RequestException as e:
        print(f"Ocorreu um erro ao chamar a API: {e}")
        return []


# --- Exemplo de Uso ---
if __name__ == "__main__":
    print("--- Executando teste do cliente ---")
    schedule_data = get_line_schedule(line_number="076")
    if schedule_data:
        print("\nHorários consultados com sucesso:")
        for control_point in schedule_data:
            print(f"\nPosto de Controle: {control_point['postoControle']}")
            # Acessando o primeiro horário como exemplo
            if control_point["horarios"]:
                first_schedule = control_point["horarios"][0]
                print(
                    f"  - Primeiro horário: {first_schedule['horario']} (Tabela: {first_schedule['tabela']})"
                )
    else:
        print("\nFalha ao consultar os horários.")
