

import DSC_Fetch from '../../shared/utils'
import {
    SRNStore,
    observable,
    action,
    SRNConfig
} from '@souche-f2e/srn-framework';


function axios() {
    DSC_Fetch(`${SRNConfig.pangolin}/pangolinEntrance/getLibraryAgeLabel.json`,{
        method:'GET',
        data:{}
      }).then(res=>{
        this.info = res[0].chineseValue
      })
}

function axiosss() {
    DSC_Fetch(`${SRNConfig.pangolin}/pangolinEntrance/getLibraryAgeLabel.json`,{
        method:'GET',
        data:{}
      }).then(res=>{
          return res
        this.info = res[0].chineseValue
      })
}


export {
    axios,
    axiosss
}