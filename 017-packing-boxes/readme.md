# Problemet handlar om att placera ut rektanglar av samma storlek.
# Se http://lagrange.ime.usp.br/~lobato/packing/run/

Min metod skapar en ram och arbetar sig in mot mitten.
På så viss erhålls mycket snabba och symmetriska lösningar,
dock erhålls inte alltid optimal lösning.

Ramens tjocklek ges av rektangelns sidor.

Exempel: 4x7

Då undersöks 4,7,4+4,4+7,4+4+4,7+7,4+4+7,4+4+4+4 ...

För varje ramtjocklek kontrolleras den inutiliggande rektangelns lösning.

