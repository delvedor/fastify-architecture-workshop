'use strict'

const Hyperid = require('hyperid')
const fp = require('fastify-plugin')

async function datasetPlugin (fastify, opts) {
  const { elastic } = fastify
  const { body: exists } = await elastic.indices.exists({ index: 'tweets' })
  if (exists) return

  const hyperid = Hyperid({ urlSafe: true })

  fastify.log.info('Missing dataset, started indexing operation')

  await elastic.indices.create({
    index: 'tweets',
    body: {
      mappings: {
        properties: {
          id: { type: 'keyword' },
          text: { type: 'text' },
          user: { type: 'keyword' },
          time: { type: 'date' },
          topics: { type: 'keyword' }
        }
      }
    }
  })

  const now = Date.now()

  const dataset = getDataset()
    .map((doc, index) => {
      doc.id = hyperid()
      // 10 mins * index
      doc.time = new Date(now - index * 1000 * 60 * 10).toISOString()
      doc.topics = doc.text
        .split(' ')
        .filter(w => w.startsWith('#'))
        .map(w => w.slice(1).replace(/[.,\s]/g, ''))
      return [{ index: { _index: 'tweets', _id: doc.id } }, doc]
    })

  const { body } = await elastic.bulk({ body: flat(dataset) })
  if (body.errors) {
    fastify.log.fatal('Something went wrong during bulk index', body)
    throw new Error('Failed to index dataset')
  }

  fastify.log.info('Dataset indexed!')
}

function getDataset () {
  return [
    { text: 'Never forget what you are, for surely the world will not. Make it your #strength. Then it can never be your #weakness. Armor yourself in it, and it will never be used to hurt you.', user: 'Tyrion' },
    { text: 'Let them see that their #words can cut you, and you’ll never be free of the mockery. If they want to give you a name, take it, make it your own. Then they can’t hurt you with it anymore.', user: 'Tyrion' },
    { text: 'When you play the game of #thrones, you win or you #die. There is no middle ground.', user: 'Cersei' },
    { text: 'If you would take a man’s life, you owe it to him to look into his eyes and hear his final words. And if you cannot bear to do that, then perhaps the man does not deserve to die.', user: 'Bran' },
    { text: 'Sorcery is the sauce fools spoon over #failure to hide the flavor of their own incompetence.', user: 'Tyrion' },
    { text: '#Power resides where men believe it resides. No more and no less.', user: 'Varys' },
    { text: 'There’s no #shame in #fear, my father told me, what matters is how we face it.', user: 'Jon' },
    { text: '#Love is #poison. A sweet poison, yes, but it will kill you all the same.', user: 'Cersei' },
    { text: 'What good is this, I ask you? He who hurries through life hurries to his #grave.', user: 'Davos' },
    { text: 'Old #stories are like old #friends, she used to say. You have to visit them from time to time.', user: 'Bran' },
    { text: 'The greatest fools are ofttimes more #clever than the men who laugh at them', user: 'Tyrion' },
    { text: 'Everyone wants something, Alayne. And when you #know what a man wants you know who he is, and how to move him.', user: 'Sansa' },
    { text: 'Always keep your foes confused. If they are never certain who you are or what you want, they cannot #know what you are like to do next. Sometimes the best way to baffle them is to make moves that have no purpose, or even seem to work against you.', user: 'Sansa' },
    { text: 'One #voice may speak you false, but in many there is always truth to be found.', user: 'Daenerys' },
    { text: '#History is a wheel, for the nature of man is fundamentally unchanging.', user: 'Rodrik' },
    { text: '#Knowledge is a #weapon, Jon. Arm yourself well before you ride forth to #battle.', user: 'Samwell' },
    { text: 'I prefer my #history dead. Dead history is write in ink, the living sort in blood.', user: 'Rodrik' },
    { text: 'In the game of #thrones, even the humblest pieces can have wills of their own. Sometimes they refuse to make the moves you’ve planned for them. Mark that well, Alayne. It’s a lesson that Cersei Lannister still has yet to learn.', user: 'Alayne' },
    { text: 'Every man should lose a #battle in his youth, so he does not lose a #war when he is old.', user: 'Victarion' },
    { text: 'The fisherman drowned, but his daughter got Stark to the Sisters before the boat went down. They say he left her with a bag of silver and a bastard in her belly. Jon Snow, she named him, after Arryn.', user: 'Davos' },
    { text: 'Men live their lives trapped in an eternal present, between the mists of memory and the sea of shadow that is all we #know of the days to come.', user: 'Bran' },
    { text: 'When I was twelve, I milked my eel into a pot of turtle stew. I flogged the one-eyed snake, I skinned my sausage, I made the bald man cry, into the turtle stew! Which I do believe my sister ate, at least I hope she did.', user: 'Tyrion' },
    { text: "There's no cure for being a #cunt.", user: 'Bronn' },
    { text: 'The man is as useless as nipples on a breastplate.', user: 'Cersei' },
    { text: 'Born amidst salt and smoke... is he a ham?', user: 'Renly' },
    { text: 'The whores are walking bowlegged.', user: 'Littlefinger' },
    { text: 'Grand Maester Pycelle made that same joke. You must be proud to be as funny as a man whose balls brush his knees.', user: 'Tyrion' },
    { text: 'What happens when the non-existent bumps against the decrepit?', user: 'Olenna' },
    { text: 'A #sword swallower, through and through.', user: 'Olenna Tyrell' },
    { text: "It's a shame the #throne isn't made out of cocks, they'd have never got him off it.", user: 'Jaime' },
    { text: "You #love your #children. It's your one redeeming quality - that, and your cheekbones.", user: 'Tyrion' },
    { text: "I understand that if anymore words come pouring out your #cunt mouth, I'm going to have to eat every fucking chicken in this room.", user: 'Hound' },
    { text: 'Yes, all Lannisters are lions. And when a Tyrell farts, it smells like a rose. But how kind is he? How clever? Has he a good heart, a gentle hand?', user: 'Olenna' },
    { text: "It's not easy being #drunk all the time. If it were easy, everyone would do it.", user: 'Tyrion' },
    { text: "Why are all the gods such vicious #cunts? Where's the #god of tits and wine?", user: 'Tyrion' },
    { text: 'The man who passes the sentence should swing the #sword.', user: 'Ned' },
    { text: 'The things I do for #love.', user: 'Jaime' },
    { text: 'I have a tender spot in my heart for cripples, #bastards and broken things.', user: 'Tyrion' },
    { text: 'I grew up with #soldiers. I learned how to die a long time ago.', user: 'Ned' },
    { text: 'Everyone is mine to torment.', user: 'Joffrey' },
    { text: 'The day will come when you think you are safe and happy, and your joy will turn to ashes in your mouth.', user: 'Tyrion' },
    { text: 'The #night is dark and full of #terrors.', user: 'Melisandre' },
    { text: 'You #know nothing, Jon Snow.', user: 'Ygritte' },
    { text: '#Night gathers, and now my watch begins', user: 'NightsWatch' },
    { text: 'A Lannister always pays his #debts.', user: 'Tyrion' },
    { text: '#Burn them all!', user: 'AerysII' },
    { text: 'What do we say to the #God of #death?', user: 'Syrio' },
    { text: 'I\'ve seen wet shits I like better than Walder Frey.', user: 'Blackfish' },
    { text: '#Winter is coming', user: 'Ned' },
    { text: 'That\'s what I do: I #drink and I #know things.', user: 'Tyrion' },
    { text: 'I am the dragon\'s daughter, and I swear to you that those who would harm you will die screaming.', user: 'Daenerys' },
    { text: 'A lion does not concern himself with the opinion of sheep.', user: 'Tywin' },
    { text: '#Chaos isn\'t a pit. Chaos is a ladder.', user: 'Littlefinger' },
    { text: 'Power resides where men believe it resides. It\'s a trick; a shadow on the wall.', user: 'Varys' },
    { text: 'If you think this has a happy #ending, you haven\'t been paying attention.', user: 'Ramsay' },
    { text: 'I would let myself be consumed by maggots before mocking the family name and making you heir to Casterly Rock.', user: 'Tywin' },
    { text: 'If you ever call me sister again, I\'ll have you strangled in your sleep.', user: 'Cersei' },
    { text: 'A girl is Arya Stark of #Winterfell. And I\'m going home.', user: 'Arya' },
    { text: 'Any man who must say \'I am the King\' is no true #King.', user: 'Tywin' },
    { text: 'Oh, monster? Perhaps you should speak to me more softly then. Monsters are dangerous and just now #Kings are dying like flies.', user: 'Tyrion' },
    { text: 'Jaime... my name\'s Jaime.', user: 'Jaime' },
    { text: 'I am your #son. I have always been your son.', user: 'Tyrion' },
    { text: 'I read it in a #book.', user: 'Samwell' },
    { text: 'If I fall, don\'t bring me back.', user: 'Jon' },
    { text: 'The big fish eat the little fish and I keep on paddling.', user: 'Varys' },
    { text: 'Lannister, Targaryen, Baratheon, Stark, Tyrell... they\'re all just spokes on a #wheel. This one\'s on top, then that one\'s on top, and on and on it spins, crushing those on the ground.', user: 'Daenerys' },
    { text: 'Hold the #door!', user: 'Hodor' },
    { text: 'Do you lie awake at #night fearing my gash?', user: 'Varys' }
  ]
}

function flat (arr) {
  const flatten = []
  for (var i = 0; i < arr.length; i++) {
    const element = arr[i]
    if (Array.isArray(element)) {
      flatten.push.apply(flatten, element)
    } else {
      flatten.push(element)
    }
  }
  return flatten
}

module.exports = fp(datasetPlugin, {
  dependencies: ['fastify-elasticsearch']
})
