const fs = require('fs')
const dateFormat = require('dateformat')
const plotGen = require('./plot_generator.js')

module.exports = class CreatePost {
  constructor(projectData) {
    this.username = projectData.golos_username
    this.projectName = projectData.project_info.blockchain.project_name
    this.shortDescription = projectData.project_info.blockchain.short_description

    if (projectData.project_info.ico.common_info.token_distribution.shares.length > 1) {
      this.tokenDistribution = projectData.project_info.ico.common_info.token_distribution.shares
    } else {
      this.tokenDistribution = []
    }
    if (projectData.project_info.ico.common_info.use_of_proceeds.length > 1) {
      this.useOfProceeds = projectData.project_info.ico.common_info.use_of_proceeds
    } else {
      this.useOfProceeds = []
    }
    
    /*
    // Registration
    this.regStart = projectData.project_info.ico.phases.registration.start_date
    this.regEnd = projectData.project_info.ico.phases.registration.end_date
    */
    // Crowdsale terms
    // this.icoStart = projectData.project_info.ico.phases.terms.dates.start_date
    // this.icoEnd = projectData.project_info.ico.phases.terms.dates.end_date
    this.icoTerms = projectData.project_info.ico.phases[0].terms.sales_agreement
    this.icoUrl = projectData.project_info.ico.phases[0].terms.sales_url
    this.totalSupply = projectData.project_info.ico.common_info.token_distribution.total_supply
    this.phases = projectData.project_info.ico.phases
    //this.issuedTokens = projectData.project_info.ico.phases.terms.issued_tokens
    // this.capLimit = projectData.project_info.ico.phases.terms.cap_limit[0].amount + ' ' + ico.phases.terms.cap_limit[0].currency
    
    // Token info
    this.tokens = projectData.project_info.token
    /*this.tokenSymbol = form.token.symbol
    this.inflationRate = form.token.inflation_rate
    this.govRightsProj = form.token.governance_rights_project
    this.govRightsOrg = form.token.governance_rights_project
    switch (form.token.token_purpose.toLowerCase()) {
      case 'ico token':
        this.tokenPurpose = 'token will be used only for fundraising\n'
        break
      case 'app token':
        this.tokenPurpose = 'token will be used only in app\n'
        break
      case 'both':
        this.tokenPurpose = 'token will be used both for fundraising and app economics\n'
        break
      default:
        this.tokenPurpose = 'unknown\n'
        break*/
    }
    createPlots (token, proceeds) {
      fs.mkdir(`./files/${this.projectName}`, (err) => {
        if (proceeds === true) {
          plotGen(this.useOfProceeds, 
          `./files/${this.projectName.replace(/[\W]/g, '')}/funds_distr.png`, 
          2)
        } 
        if(token === true) {
          plotGen(this.tokenDistribution, 
          `./files/${this.projectName.replace(/[\W]/g, '')}/token_distr.png`, 
          1)
        }
      })
    }
    createShortDescr () {
      return `Author: [${this.username}](https://golos.io/@${this.username})\n## Short description \n${this.shortDescription}\n`
    }
    createDistrDescr () {
      let fundsDistrStr, tokenDistrStr
      if (this.useOfProceeds.length > 0 && this.tokenDistribution.length <1) {
        fundsDistrStr = `\n\n### Use of proceeds:
          ![](http://ninja-analytics.ru/static/${this.projectName.replace(/[\W]/g, '')}/funds_distr.png)
          \nDescription | Percent\n--|--` + 
          this.useOfProceeds.reduce((str, curr) => str += `\n${curr.description} | ${curr.percent}`, '')
        tokenDistrStr = ''
        // this.createPlots(false, true)
      }
      else if (this.useOfProceeds.length < 1 && this.tokenDistribution.length > 0) {
        tokenDistrStr = `\n\n### Token distribution
        ![](http://ninja-analytics.ru/static/${this.projectName.replace(/[\W]/g, '')}/token_distr.png)
        \nDescription | Percent\n--|--` +
        this.tokenDistribution.reduce((str, curr) => {
          str += `\n${curr.description} | ${curr.percent}`
          return str
        }, '')
        fundsDistrStr = ''
        // this.createPlots(true, false)
      }
      else if (this.useOfProceeds.length > 0 && this.tokenDistribution.length > 0) {
        fundsDistrStr = `\n### Use of proceeds:
          ![](http://ninja-analytics.ru/static/${this.projectName.replace(/[\W]/g, '')}/funds_distr.png)
          \nDescription | Percent\n--|--\n` + this.useOfProceeds.reduce((str, curr) => str += `${curr.description} | ${curr.percent}\n`, '')
        tokenDistrStr = `\n### Token distribution
        ![](http://ninja-analytics.ru/static/${this.projectName.replace(/[\W]/g, '')}/token_distr.png)
        \nDescription | Percent\n--|--\n` +
        this.tokenDistribution.reduce((str, curr) => {
          str += `${curr.description} | ${curr.percent}\n`
          return str
        }, '')
        // this.createPlots(true, true)
      }
      else {
        fundsDistrStr = ''
        tokenDistrStr = ''
      }
      return fundsDistrStr + ' ' + tokenDistrStr
    }
    createIcoCommonDescr () {
      return `## Crowdsale \n**Crowdsale agreement**: ${this.icoTerms} 
\n\n**Crowdase website**: ${this.icoUrl} \n\n**Total token supply**: ${this.totalSupply} ${this.createDistrDescr()}`
    }
    createIcoPhasesDescr () {
      const phasesDescr = this.phases.map(phase => {
        console.log(phase.dates.start_date)
        const issuedStr = phase.terms.issued_tokens === '' ? '' : 
          `\n\n**Amount of tokens issued in this phase**: ${phase.terms.issued_tokens}`
        const capLimitStr = phase.terms.cap_limit[0].currency === '' ? '' :
          `\n\n**Cap limit**: ${phase.terms.cap_limit[0].amount} ${phase.terms.cap_limit[0].currency}`

        return `\n### ${phase.phase_name} \n**Current status**: 
${phase.phase_status}\n\n**Start date**: ${dateFormat(phase.dates.start_date, 'fullDate')}
\n\n**End date**: ${dateFormat(phase.dates.end_date, 'fullDate')}${issuedStr}${capLimitStr}`
      })
      return `\n## Crowdsale phases \n` + phasesDescr.join('\n')
    }
    createTokenDescr () {
      const tokensStr = this.tokens.map(token => {
        let purposeStr = ''
        switch (token.token_purpose.toLowerCase()) {
          case 'raising funds':
            purposeStr = 'token will be used only for fundraising'
            break
          case 'utility':
            purposeStr = 'token will be used only in app'
            break
          case 'both':
            purposeStr = 'token will be used both for fundraising and app economics'
            break
          default:
            purposeStr = 'unknown'
            break
        }
        let type = ''
        switch (token.token_type.toLowerCase()) {
          case 'core token':
            type = 'Core token - token uses its own blockchain'
            break
          case 'blockchain issued token':
            type = 'Blockchain issued token - token uses an existing blockchain'
            break
        }

        // Conditions for optional fields
        const inflationStr = token.inflation_rate === '' ? '' : `**Inflation/deflation rate**: ${token.inflation_rate}`
        const circStr = token.circulation_terms === '' ? '' : `\n\n**Circulation terms**: ${token.circulation_terms}`
        const govOrgStr = token.governance_rights_org === '' 
          ? '' : `\n\n**Rights to govern the operational organization**: ${token.governance_rights_org}`
        const govProjStr = token.governance_rights_project === '' 
          ? '' : `\n\n**Rights to vote for the course of the project development**:  ${token.governance_rights_project}`

        // Full string 
        return `\n### ${token.name}\n\n**Token symbol**: ${token.symbol}\n\n**Token purpose**: ${purposeStr}\n\n**Token type**: ${type}\n\n${inflationStr}${circStr}${govOrgStr}${govProjStr}`
      })
      return `\n## Tokens \n${tokensStr.join('\n')}` // ##Token
    }
    createPost () {
      return this.createShortDescr() + this.createIcoCommonDescr() + this.createIcoPhasesDescr() + this.createTokenDescr()
    }
}

/*
const createPost = (data) => {
  
  const supplyStr = (form.token.total_supply !== undefined)?
    `\nTotal supply: ${form.token.total_supply}\n`:''
 

  // String forICO description
  const regDatesStr = (form.ico.reg_start_date_date!==undefined && form.ico.reg_end_date_date!==undefined)?
    `\nRegistration period: ${dateFormat(form.ico.reg_start_date_date, 'fullDate')} - ${dateFormat(form.ico.reg_end_date_date, 'fullDate')}\n`:''
  const regSiteStr = (form.ico.reg_url!==undefined)?
    `\nRegistration page: ${form.ico.reg_url}\n`:''
  const issuedStr = (form.ico.issued_tokens!==undefined)?
    `\n\nAmount of tokens issued to sale: ${form.ico.issued_tokens} ${form.token.symbol}\n`:''
  const tokenDistrDate = (form.ico.token_distr_date!==undefined)?
    `\nToken distribution date: ${dateFormat(form.ico.token_distr_date, 'fullDate')}\n`:''
  const capStr = (form.ico.cap_limit_amount!==undefined)?
    `\Cap limit: ${form.ico.cap_limit_amount} ${form.ico.cap_limit_currency}\n`:''
  
  const icoStr = `\n## ICO${regDatesStr}${regSiteStr}
  ICO start and end dates: ${dateFormat(form.ico.ico_start_date_date, 'fullDate')} - ${dateFormat(form.ico.ico_end_date_date, 'fullDate')}

  Crowdsale page: ${form.ico.sales_url}${issuedStr}${tokenDistrDate}${capStr}

  Crowdsale terms: ${form.ico.sales_agreement}


  `
  // Links string
  const linksList = form.links.reduce((str, curr) => str += `\n* [${curr.name}](${curr.url})`, '')
  const linksStr = `\n## Useful links\n${linksList}`

  // Full post string
  const fullPost = `${descrStr}${tokenStr}${icoStr}${linksStr}\n\n`
  return fullPost
}
module.exports = createPost*/
