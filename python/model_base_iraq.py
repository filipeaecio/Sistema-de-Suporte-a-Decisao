import time

PONTOS = range(47)
CAMPOS = range(24)
TIPOS_ARMAZENS = range(8)
CAMPOS_A = (1,2,4,5,7, 19,10,17)
CAMPOS_B = (8,14,11, 21,18)
CAMPOS_C = (13,9,15,16,20,22,23,3, 12, 0, 6)

# Model
m = Model("iraq")

### VARIÁVEIS DE DECISÃO

# Quantidade de produtos entregues pelo armazém localizado no ponto i para o campo n
B = []
for i in PONTOS:
    B.append([])
    for n in CAMPOS:
        B[i].append(m.addVar(name="B_%d_%d" % (i, n)))											  

# 1 se no ponto i for aberto um armázem do tipo k
Z = []
for i in PONTOS:
    Z.append([])
    for k in TIPOS_ARMAZENS:
        Z[i].append(m.addVar(vtype=GRB.BINARY, name="Z_%d_%d" % (i, k)))											  

# Fluxo de produtos saindo do ponto a para o ponto b na rota de entrega para o campo n
X = []
for a in PONTOS:
    X.append([])
    for b in PONTOS:
        X[a].append([])
        for n in CAMPOS:
            X[a][b].append(m.addVar(name="X_%d_%d_%d" % (a, b, n)))

## Tempo de entrega médio para cada campo
Wcampo = []
for n in CAMPOS:
    Wcampo.append(m.addVar(name="mWcampo_%d" % n))

## Quantidade de pontos de gargalo para cada campo
Ycampo = []
for n in CAMPOS:
    Ycampo.append(m.addVar(name="nYcampo_%d" % n))

# Maior tempo de entrega médio dentre todos os campos
W = m.addVar(name="W")

# Maior quantidade de pontos de gargalo médio dentre todos os campos
Y = m.addVar(name="Y")

# Custo total
R = m.addVar(name="R")

# Custos individuais
## Custo transporte por agencia
RTA = m.addVar(name="RTA")
RTB = m.addVar(name="RTB")
RTC = m.addVar(name="RTC")

## Custo fixos totais
RFT = m.addVar(name="RFT")

### RESTRIÇÕES

# CAPACIDADE DOS ARMÁZENS
for i in PONTOS:
    m.addConstr(sum(B[i][n]*f[i][n] for n in CAMPOS) <= sum(v[i][k]*Z[i][k]*capacidade[k] for k in TIPOS_ARMAZENS), "Capacidade_%d" % (i))

# Cada ponto deve ter 1 e somente 1 tipo de armázem
for i in PONTOS:
    m.addConstr(sum(v[i][k]*Z[i][k] for k in TIPOS_ARMAZENS) == 1, "Abriu_%d" % (i))

# Balanço de massa em cada ponto
for i in PONTOS:
    for n in CAMPOS:
        m.addConstr(B[i][n]*f[i][n]  - d[i][n] == sum(X[i][a][n]*arcoExiste[i][a] for a in PONTOS) - sum(X[b][i][n]*arcoExiste[b][i] for b in PONTOS), "Balanco_%d_%d" % (i, n))

# Atender a demanda
for n in CAMPOS:
    m.addConstr(d[n][n]  <= sum(B[i][n]*f[i][n] for i in PONTOS), "Demanda_%d" % (n))

# Custo total
m.addConstr(R == RTA + RTB + RTC + RFT,"CUSTO")

m.addConstr(RTA == sum(sum(sum(X[a][b][n]*c[a][b] for a in PONTOS) for b in PONTOS)for n in CAMPOS_A), "CUSTO_A")

m.addConstr(RTB == sum(sum(sum(X[a][b][n]*c[a][b] for a in PONTOS) for b in PONTOS)for n in CAMPOS_B),"CUSTO_B")

m.addConstr(RTC == sum(sum(sum(X[a][b][n]*c[a][b] for a in PONTOS) for b in PONTOS)for n in CAMPOS_C),"CUSTO_C")

m.addConstr(RFT == sum(sum(Z[i][k]*custo_fixo[k] for i in PONTOS) for k in TIPOS_ARMAZENS),"CUSTO_FIXO")

# Tempo de entrega
for n in CAMPOS:
    m.addConstr(sum(sum(X[a][b][n]*t[a][b] for a in PONTOS) for b in PONTOS)/(60*d[n][n]) == Wcampo[n], "Tempo1_%d" % (n))

for n in CAMPOS:
    m.addConstr(Wcampo[n] <= W, "Tempo_%d" % (n))
# Checkpoints
#for n in CAMPOS:
    m.addConstr(sum(sum(X[a][b][n]*p[a][b] for a in PONTOS) for b in PONTOS)/d[n][n] == Ycampo[n], "Checkpoints1_%d" % (n))

    m.addConstr(Ycampo[n] <= Y, "Checkpoints_%d" % (n))
#########################################################################################################

