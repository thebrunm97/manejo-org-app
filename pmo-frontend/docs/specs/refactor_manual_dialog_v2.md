# Technical Specification: Manual Record Dialog Refactor v2

## 1. Centralização de Constantes

Para eliminar a repetição de strings e facilitar a manutenção, as listas de unidades serão extraídas para arrays constantes. Isso deve ser feito fora do componente ou em um arquivo de configuração separado (`src/utils/constants.ts` ou localmente se preferir).

### Definições:

```typescript
export const UNIDADES_PLANTIO = [
  'unid', 
  'maço', 
  'kg', 
  'g', 
  'm2', 
  'cx', 
  'ton'
];

export const UNIDADES_MANEJO = [
  'L/ha', 
  'kg/ha', 
  'ml/L', 
  'g/planta', 
  'ml/planta', 
  'unid'
];

export const UNIDADES_COLHEITA = [
  'kg', 
  'ton', 
  'cx', 
  'maço', 
  'unid'
];
```

## 2. Estratégia de Renderização Resiliente (Fallback)

O erro "out-of-range" ocorre quando o `value` do `Select` não corresponde a nenhum `MenuItem`. Para corrigir isso, implementaremos uma função helper que injeta dinamicamente o valor "desconhecido" na lista de opções.

### Helper Function: `renderUnitSelect`

Esta função encapsulará a lógica de renderização do `Select` de unidades.

**Assinatura:**
```typescript
const renderUnitSelect = (
  value: string, 
  setValue: (val: string) => void, 
  options: string[], 
  label: string = "Unid"
) => { ... }
```

**Lógica de Implementação:**

1.  **Verificação de Existência:**
    Verificar se o `value` atual (ex: "MAÇO") existe no array `options` (ex: `['unid', 'maço', ...]`).
    
2.  **Injeção de Fallback:**
    Se o valor existe e não está vazio, e **NÃO** está na lista `options`, renderizar um `<MenuItem>` extra no topo da lista.
    Este item extra garante que o componente Select encontre um filho correspondente ao seu valor atual.

3.  **Renderização:**
    Retornar a estrutura padrão do MUI (`FormControl` > `InputLabel` > `Select` > `MenuItem`s).

**Pseudo-código da Lógica:**

```tsx
const isCustomValue = value && !options.includes(value);

return (
  <FormControl sx={{ minWidth: 100 }}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} onChange={e => setValue(e.target.value)}>
      
      {/* 🛡️ FALLBACK ITEM: Previne o crash 'out-of-range' */}
      {isCustomValue && (
        <MenuItem value={value} sx={{ fontStyle: 'italic', color: 'warning.main' }}>
          {value} (Legado)
        </MenuItem>
      )}

      {/* Opções Padrão */}
      {options.map(opt => (
        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
      ))}

    </Select>
  </FormControl>
);
```

## 3. Refatoração do Componente `ManualRecordDialog.tsx`

### Passos de Execução:

1.  **Remover Listas Hardcoded:**
    Substituir os blocos repetitivos de `<MenuItem>` nas tabs Plantio, Manejo e Colheita pelo uso das constantes e do helper.

2.  **Implementar Helper Local:**
    Adicionar a função `renderUnitSelect` dentro do componente (ou fora, se não depender de contexto) para reutilização nas 3 tabs.

3.  **Aplicação nas Tabs:**

    *   **Tab Plantio:**
        Substituir o `FormControl` da unidade de plantio por:
        ```tsx
        {renderUnitSelect(unidadePlantio, setUnidadePlantio, UNIDADES_PLANTIO)}
        ```

    *   **Tab Manejo:**
        Substituir o `FormControl` da unidade de dosagem por:
        ```tsx
        {renderUnitSelect(unidadeDosagem, setUnidadeDosagem, UNIDADES_MANEJO)}
        ```
    
    *   **Tab Colheita:**
        Adicionar seletor de unidade se necessário (atualmente o código não mostra seletor explícito na tab Colheita, validar se deve usar `UNIDADES_COLHEITA` ou se mantém o comportamento atual implícito). *Nota: O código atual não tem seletor de unidade na Colheita, focar nas outras duas ou adicionar se for requisito novo.*

4.  **Manutenção de Funcionalidades:**
    *   Garantir que `data_registro` continue sendo convertido corretamente: `new Date(dataHora).toISOString()`.
    *   Manter a lógica de conversão de tipos (`parseFloat`) no `handleSave`.

## 4. Benefícios Esperados

*   **Robustez:** O app não travará mais ao abrir registros com unidades antigas ou mal formatadas ("Maço" vs "maço").
*   **Manutenibilidade:** Adicionar uma nova unidade requer alterar apenas uma linha no array de constantes.
*   **Código Limpo:** Redução significativa de linhas de código repetitivo (JSX boilerplate).
