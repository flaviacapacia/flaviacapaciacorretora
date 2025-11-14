# Caminhos dos projetos
$apiProject = "MeuSiteImoveis.api\MeuSiteImoveis.api.csproj"
$siteProject = "flaviacapaciacorretora\flaviacapaciacorretora.csproj"

# Inicia a API em um terminal separado
Start-Process powershell -ArgumentList "dotnet run --project $apiProject"

# Inicia o Site em outro terminal separado
Start-Process powershell -ArgumentList "dotnet run --project $siteProject"

# Aguarda alguns segundos para os servidores subirem
Start-Sleep -Seconds 5

# Abre os navegadores (ajuste as portas conforme aparecer no log)
Start-Process "http://localhost:5000"
Start-Process "http://localhost:5247"
