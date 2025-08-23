import { PrimaryPort } from '../../divisions/ports/PrimaryPort';

export class PaesExerciseAdapter implements PrimaryPort {
  async executeCommand(command: string, payload: unknown): Promise<unknown> {
    switch (command) {
      case 'fetchExercises':
        // Simulación de llamada a base de datos o API Supabase
        return this.fetchExercises(payload);
      default:
        throw new Error(`Comando no soportado: ${command}`);
    }
  }

  private async fetchExercises(payload: any): Promise<any> {
    // Aquí iría la lógica real para obtener ejercicios PAES
    // Por ahora, retorno simulado
    return [
      { id: 1, title: 'Ejercicio 1', difficulty: 'medio' },
      { id: 2, title: 'Ejercicio 2', difficulty: 'alto' }
    ];
  }
}