    // Verifica se a imagem está armazenada no localStorage
    const profilePic = localStorage.getItem('profilePic');
    
    // Se a imagem existir, define o src da imagem
    if (profilePic) {
      document.getElementById('profile-pic').src = profilePic;
    } else {
      // Se a imagem não existir, exibe uma mensagem ou uma imagem padrão
      console.log('Imagem de perfil não encontrada no localStorage');
      // document.getElementById('profile-pic').src = 'imagem-padrao.jpg';
    }