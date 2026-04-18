# Registo de Riscos

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-18

---

| Risco | Probabilidade | Impacto | Mitigação | Estado |
|---|---|---|---|---|
| Integração difícil com a API Copernicus (OAuth2, STAC, limites) | Média | Alto | Prova de conceito na semana 7; isolamento em copernicus.ts; modo mock para demo | Activo |
| Sobredimensionamento do âmbito compromete o núcleo | Alta | Alto | MoSCoW rigoroso; qualquer extensão documentada no changelog; Must Have protegido | Activo |
| Serviço externo indisponível (Copernicus ou Nominatim) | Baixa | Médio | Try/catch em todos os serviços; mensagens amigáveis; dados mock para demo académica | Mitigado |
| Leaflet com SSR no Next.js (window não existe no servidor) | Alta | Médio | Importação dinâmica com ssr:false implementada; documentado no código | Mitigado |
| Tempo insuficiente para documentação | Média | Alto | Changelog semanal; comentários PT no código desde o início; ADRs escritos à medida | Activo |
| Aprendizagem de ferramentas novas (Leaflet, STAC, OAuth2) | Média | Médio | Semanas 5–6 para prototipagem; protótipo de interface já concluído | Parcialmente mitigado |
| Decisões arquitecturais não defensáveis em júri | Baixa | Alto | ADRs com contexto/decisão/consequências; código comentado em PT; tudo documentado | Activo |
| Exposição de credenciais Copernicus no repositório | Baixa | Alto | .gitignore inclui .env.local; .env.example sem valores reais | Mitigado |
