const { members } = require('../../schema');

module.exports.makeMemberDb  =  function () {
  return Object.freeze({
    findByHash,
    updateByHash,
    insert,
  });

   
  async function insert(memberObject) {
    const newMemberId = members.add(memberObject);
    return {id:newMemberId, ...memberObject };
  }

  async function findByHash({ hash }) {
   const member = members.readOne({memberId: hash});
   return member;
  }

  async function updateByHash({
     memberId, 
     name, 
     phoneNumber, 
     address,
  } = {}) {
  
    members.update({
      memberId, 
      name, 
      phoneNumber, 
      address,
    });
  
  }
    
}
