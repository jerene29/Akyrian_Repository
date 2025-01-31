class LoginPage{
    get logo(){
        return cy.get('[class="Login__Logo-fhuIQI VoBaS pointer"]');
    }
    get logo_AfterLogin(){
return cy.get('[class="SidebarOnboarding__Logo-bXJxWO kCJYty"]');
}
get logo_Text(){    
        return cy.get('[class="Text__StyledText-fcSGOX fHgebP title-good-day"]');  
  } 
 get logo_Text1(){   
         return cy.get('[class="Text__StyledText-fcSGOX fHgebP"]');   
     }   
      get Welcome(){  
              return cy.get('[class="Text__StyledText-fcSGOX fHgebP mb-5 mt-5"]'); 
       }   
      get Email(){    
            return cy.get('label[for="email"]')   
     }   
      get Password(){   
             return cy.get('label[for="password"]')
            }   
         get Login(){      
              return cy.get('[class="Button__Container-gknlFx hMdVMW mt-3"]')  
          }   
         get Study_Text(){   
                 return cy.get('[class="Text__StyledText-fcSGOX kZdsfX mb-30"]')   
             }    get Search(){   
                     return cy.get('[class="Text__StyledText-fcSGOX dbePOD pointer search-text"]')  
                  }   
                 get Click_Study(){       
                     return cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]')    
                    }   
                     get Allstudy_Text(){    
                            return cy.get('[class="Text__StyledText-fcSGOX kZdsfX text-allsite"]') 
                       }   
                      get EDC_Text(){   
                             return cy.get('[class="Text__StyledText-fcSGOX fgQWnN"]') 
                           }    
                         get EDC_Hint(){   
                                 return cy.get('[class="tooltip-icon"]').eq(0)  
                              }    

                            get EDC_Hint1(){   
                                     return cy.get('[class="ant-tooltip-inner"]').eq(0)  
                                  }    
                                get SDE_Text(){   
                                         return cy.get('[class="Text__StyledText-fcSGOX jJYZxA"]') 
                                       }   
                                      get SDE_Hint(){    
                                            return cy.get('[class="tooltip-icon"]') 
                                       }   
                                      get SDE_Hint1(){      
                                          return cy.get('[class="ant-tooltip-inner"]')  
                                      }  
                                      get Add_study(){    
                                            return cy.get('[class="Text__StyledText-fcSGOX liUSLx add-patient-text"]')  
                                      }    get Stream_Text(){ 
                                               return cy.get('[class="Text__StyledText-fcSGOX fvUTrR"]') 
                                           }   
                                          get Stream_Text1(){  
                                                  return cy.get('[class="Text__StyledText-fcSGOX eHtBLA"]').eq(0)   
                                         }    get Stream_Text2(){  
                                                  return cy.get('[class="Text__StyledText-fcSGOX eHtBLA"]').eq(1)   
                                         }    get Click_StudySubject(){ 
                                                   return cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]')  
                                              }        get StudySubject(){  
                                                      return cy.get('[class="Text__StyledText-fcSGOX kNgNur mb-3 patient-id cuy"]')   
                                             }    get EDC(){    
                                                    return cy.get('[class="VisitQuestions__TabTitleContainer-kTbECU gIArBa"]').eq(0)  
                                              }    
                                            get Click_Newvisit(){   
                                                     return cy.get('[class="Text__StyledText-fcSGOX bOGOVy progress-visit-text"]') 
                                                   }    
                                                  get All()
                                                  {     
                                                       return cy.get('[class="Button__Container-gknlFx hMdVMW all-button"]')  
                                                      }  
                                                     get Unanswered(){      
                                                          return cy.get('[class="Text__StyledText-fcSGOX jJYZxA left"]').eq(0)   
                                                     }    
                                                     get Rejected(){   
                                                             return cy.get('[class="Text__StyledText-fcSGOX jJYZxA left"]').eq(1)   
                                                         }    get Answered(){ 
                                                             return cy.get('[class="Text__StyledText-fcSGOX jJYZxA left"]').eq(2) 
                                                               }    
                                                             get Pending_Approval(){  
                                                                      return cy.get('[class="Text__StyledText-fcSGOX jJYZxA left"]').eq(3)  
                                                              }    
                                                            get Q1(){        
                                                                return cy.get('[class="Text__StyledText-fcSGOX fvNYh"]').eq(0)  
                                                              }   
                                                             get Q2(){    
                                                                    return cy.get('[class="Text__StyledText-fcSGOX fvNYh"]').eq(1)  
                                                              }   
                                                             get Q3(){       
                                                                 return cy.get('[class="Text__StyledText-fcSGOX fvNYh"]').eq(2)   
                                                                 }   
                                                                  get Q4(){  
                                                                          return cy.get('[class="ant-col"]')   
                                                                 }  
                                                                      get Q1Type(){     
                                                                           return cy.get('[class="text-field coachmark_streamlinesc_dataEntryField"]').eq(1)   
                                                                         }    
                                                                         get Q11Type(){     
                                                                               return cy.get('[class="text-field coachmark_streamlinesc_dataEntryField"]').eq(0)   
                                                                             }    get Q2Type(){  
                                                                                      return cy.get('[placeholder="Select date"]')  
                                                                              }    get DatePicker(){  
                                                                                      return cy.get('[class="ant-picker-input"]:visible')  
                                                                              }    get SelectDatePicker(){      
                                                                                  return cy.get('[class="ant-picker-dropdown ant-picker-dropdown-placement-bottomLeft"]',{timeout:10000})    }    get Yes(){        return cy.get('[class="ant-radio"]').eq(0)    }    get No(){        return cy.get('[class="ant-radio"]').eq(1)    

                                                                                }   
                                                                                 get MarkNo(){     
                                                                                       return cy.get('[class="ant-radio-input"]').eq(2)  
                                                                                      }  
                                                                                       get Save(){      
                                                                                          return cy.get('[class="Button__Container-gknlFx jnEFG btn-query-question-locked pl-3 ml-3"]')    }

}
export default new LoginPage();