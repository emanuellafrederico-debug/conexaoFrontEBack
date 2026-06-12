const apiUrl = 'http://localhost:8080/usuarios';
let idAlunoEmEdicao = null;

async function listarAlunos() {
    //request http
        const resposta = await fetch(`${apiUrl}`);

        //transforma em JSON
        const dados = await resposta.json();

        const user = Array.isArray(dados) ? dados[0] : dados;

    try {
        

        let valorMedia = ((user.nota1+user.nota2+user.nota3)/3);

        let valorAprovado;

        if (valorMedia >= 7) {
            valorAprovado = "Aprovado.";
        } else {
            valorAprovado = "Reprovado."
        }

        dados.forEach(user => {
            const spanTexto = document.createElement('span')
            spanTexto.innerHTML = `
            <p><strong>Nome:</strong>${user.nome}</p>
            <p><strong>Sobrenome:</strong>${user.sobrenome}</p>
            <p><strong>Média:</strong>${valorMedia}</p>
            <p><strong>Situação:</strong>${valorAprovado}</p>` 
            
            let lista = document.getElementById("resultado");
            let li = document.createElement('li');

            let btnDeletar = document.createElement('button');
            btnDeletar.textContent = 'Deletar';
            btnDeletar.onclick = () => deletarAluno(user.id);

            let btnEditar = document.createElement('button');
            btnEditar.textContent = 'Atualizar';
            btnEditar.onclick = () => prepararEdicao(user);

            li.appendChild(spanTexto);
            li.appendChild(btnDeletar);
            li.appendChild(btnEditar);

            lista.appendChild(li);
        });
        
    } catch(error) {
        resultado.innerHTML = "Erro ao buscar dados."
    }
}

function prepararEdicao(aluno) {
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('sobrenome').value = aluno.sobrenome;
    document.getElementById('nota1').value = aluno.nota1;
    document.getElementById('nota2').value = aluno.nota2;
    document.getElementById('nota3').value = aluno.nota3;
    idAlunoEmEdicao = aluno.id; 
}


document.getElementById("adicionar").addEventListener('click',async function() {
    let valorNome = document.getElementById("nome").value;
    let valorSobrenome = document.getElementById("sobrenome").value;
    let valorNota1 = document.getElementById("nota1").value;
    let valorNota2 = document.getElementById("nota2").value;
    let valorNota3 = document.getElementById("nota3").value;


    if (valorNome === "" || valorSobrenome === "" ) {
        alert("Digite o nome do aluno.");
        return;
    }

    if ((valorNota1 === "") || (valorNota2 === "") || (valorNota3 === "") || (valorNota1 > 10) || (valorNota2 > 10) || (valorNota3 > 10)) {
        alert("Digite uma nota válida.");
        return;
    }    

    const dados = {
        nome: valorNome,
        sobrenome: valorSobrenome,
        nota1: valorNota1,
        nota2: valorNota2,
        nota3: valorNota3
    };

    try {
        if (idAlunoEmEdicao !== null) {
            console.log(`Tentando atualizar o aluno com ID: ${idAlunoEmEdicao}`, dados);
            await atualizarAluno(idAlunoEmEdicao, dados);
            idAlunoEmEdicao = null; 
            alert("Aluno atualizado com sucesso!");
        } else {
            console.log("Tentando cadastrar um novo aluno", dados);
            await cadastrarAluno(dados);
            alert("Aluno cadastrado com sucesso!");
        }
        
        limparCampos();
        listarAlunos();

    } catch (erro) {
        console.error("Erro na operação:", erro);
        alert("Não foi possível cadastrar este usuário.");
    }
});

async function cadastrarAluno(dados) {
    await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}

async function atualizarAluno(id, dados) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}


async function deletarAluno(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este aluno?");
    if (confirmacao) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        listarAlunos();
    }
}

function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("sobrenome").value = "";
    document.getElementById("nota1").value = "";
    document.getElementById("nota2").value = "";
    document.getElementById("nota3").value = "";
}