import { IFieldGroupVisitDetail, IResponseQueryStatus, ISortFilter } from "../../src/graphQL/generated/graphql";
import { IFilterVisitQuestion } from "interfaces/visit";

export  const generateSort = (sort? :string | null) => {
    if (sort === ISortFilter.PatientStudyId) {
      return undefined;
    } else if (sort === ISortFilter.Outstanding) {
      return ISortFilter.Outstanding;
    } else if (sort === ISortFilter.Unverified) {
      return ISortFilter.Unverified;
    } else if (sort === ISortFilter.UnresolvedQuery) {
      return IResponseQueryStatus.Unresolved;
    } else if (sort === ISortFilter.AnsweredQuery) {
      return IResponseQueryStatus.Answered;
    } else {
      return undefined;
    }
  };

 export const handleFieldsSearch = (data: any, searchInput: any) => {
    let fromFields = false;
    if (data.fields.length > 0) {
      data.fields.map((field: any) => {
        if (searchInput.toLowerCase() && (field.question.toLowerCase().includes(searchInput.toLowerCase()) ||
        field.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
        field.shortQuestion.toLowerCase().includes(searchInput.toLowerCase())
        )) {
          fromFields = true;
          return fromFields;
        }
      });
    }
    return fromFields;
  };

  export const exists = (arr: any, search: any) => {
    return arr.some((row: any) => row.includes(search));
  };

  export const FilterQuestion =  (
    questions: any,
    searchInput: any,
    sort: string | undefined = undefined,
    visitData: any | undefined = undefined,
    withSource = false,
    isInvestigator = false
  ) => {
    try {
      let totalCount = questions?.length || 0;
      let renderedQuestionsData:IFieldGroupVisitDetail[] = [...questions];
  
      const handleInput = () => {
        totalCount = 0;
        return renderedQuestionsData.filter(data => {
          if (searchInput.toLowerCase() && (data.question.toLowerCase().includes(searchInput.toLowerCase()) ||
          data.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
          data.shortQuestion.toLowerCase().includes(searchInput.toLowerCase()) ||
          handleFieldsSearch(data, searchInput)
          )) {
            totalCount += 1;
            return data;
          }
        });
      };
  
      if (generateSort(sort) === IResponseQueryStatus.Unresolved || generateSort(sort) === IResponseQueryStatus.Answered) {
        renderedQuestionsData = questions.filter((data: any) => {
          if ((generateSort(sort) && data.responseQueryStatus === generateSort(sort))) {
            return data;
          }
        });
        if (searchInput) {
          renderedQuestionsData = handleInput();
        }
        totalCount = renderedQuestionsData.length;
      } else if (generateSort(sort) === ISortFilter.Outstanding) {
        if (visitData) {
          const isNotComplete = !isInvestigator ? visitData.userVisitData.filter((userVisit : any) => userVisit.isComplete === false) : visitData.filter((userVisit: any) => userVisit.isComplete === false);
          const completeStatus = isNotComplete.map((notComplete: any) => {
            return notComplete.status;
          });
          renderedQuestionsData = questions.filter((question: any) => {
            if (completeStatus.length && question.formFieldGroupResponse) {
              const result = completeStatus.filter((res: any) => {
                return res.includes(question?.formFieldGroupResponse?.status);
              });
              if (exists(result, question?.formFieldGroupResponse?.status)) {
                return question;
              }
            }
          });
          if (searchInput) {
            renderedQuestionsData = handleInput();
          }
          totalCount = renderedQuestionsData.length;
        }
      } else if (generateSort(sort) === ISortFilter.Unverified && withSource) {
        if (visitData) {
          const isNotVerified = !isInvestigator ? visitData.sourceCaptures.filter((source: any) => {
            if (source.isVerified === false) {
              return source;
            }
          }) : visitData.filter((source: any) => {
            if (source.isVerified === false) {
              return source;
            }
          });
          renderedQuestionsData = questions.filter((elem: any) => {
            return isNotVerified.find(({ id }: any) => {
  
              return elem?.formFieldGroupResponse?.sourceCaptureId === id;
            });
          });
          if (searchInput) {
            renderedQuestionsData = handleInput();
          }
          totalCount = renderedQuestionsData.length;
        }
      } else if (searchInput) {
        totalCount = 0;
        renderedQuestionsData = questions.filter((data: any) => {
          if (searchInput.toLowerCase() && (data.question.toLowerCase().includes(searchInput.toLowerCase()) ||
          data.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
          data.shortQuestion.toLowerCase().includes(searchInput.toLowerCase()) ||
          handleFieldsSearch(data, searchInput)
          )) {
            totalCount += 1;
            return data;
          }
        });
      }
  
      return {
        renderedQuestionsData,
        totalCount
      };
    } catch (error) {
      return {
        renderedQuestionsData: [],
        totalCount: 0
      };
    }
  };

  export const getQuestionFilter = (questionFilters: any[], searchInput?: string, sort?: string | null, ffg?: any): IFilterVisitQuestion[] => {
    const newQuestionFilters: IFilterVisitQuestion[] = questionFilters.map(questionFilter => {
      const newQuestionFilter: IFilterVisitQuestion = { ...questionFilter } as unknown as IFilterVisitQuestion;
      const filtered = ffg.filter((fieldGroup: any) => fieldGroup.formFieldGroupResponse?.status === String(questionFilter.status[0]) || fieldGroup.formFieldGroupResponse?.status === String(questionFilter.status[1]));
      let filteredBySearch = filtered;
      if (filtered && filteredBySearch) {
        if (sort) {
          if (generateSort(sort) === IResponseQueryStatus.Unresolved || generateSort(sort) === IResponseQueryStatus.Answered) {
            filteredBySearch = filtered.filter((data: any) => {
              if (generateSort(sort) && data.responseQueryStatus === generateSort(sort)) {
                return data;
              }
            });
            if (searchInput) {
              filteredBySearch = filteredBySearch.filter((data: any) => {
                if (searchInput && (data.question.toLowerCase().includes(searchInput.toLowerCase()) ||
                  data.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
                  data.shortQuestion.toLowerCase().includes(searchInput.toLowerCase()) ||
                  handleFieldsSearch(data, searchInput)
                )) {
                  return data;
                }
              });
            }
          } else if (generateSort(sort) === ISortFilter.Outstanding) {
            if (questionFilters && questionFilters.length) {
              const isNotComplete = questionFilters.filter((userVisit: any) => userVisit.isComplete === false);
              const completeStatus: any = isNotComplete.map((notComplete: any) => {
                return notComplete.status;
              });
              filteredBySearch = filteredBySearch.filter((question: any) => {
                if (completeStatus.length) {
                  if (question.formFieldGroupResponse) {
                    const result = completeStatus.filter((res: any) => {
                      return res.includes(question.formFieldGroupResponse?.status);

                    });
                    if (exists(result, question.formFieldGroupResponse.status)) {
                      return question;
                    }
                  }
                }
              });
              if (searchInput) {
                filteredBySearch = filteredBySearch.filter((data: any) => {
                  if (searchInput && (data.question.toLowerCase().includes(searchInput.toLowerCase()) ||
                    data.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
                    data.shortQuestion.toLowerCase().includes(searchInput.toLowerCase()) ||
                    handleFieldsSearch(data, searchInput)
                  )) {
                    return data;
                  }
                });
              }
            }
          }
        } else if (searchInput && !sort) {
          filteredBySearch = filtered.filter((data: any) => {
            if (searchInput && (data.question.toLowerCase().includes(searchInput.toLowerCase()) ||
              data.keywords.toLowerCase().includes(searchInput.toLowerCase()) ||
              data.shortQuestion.toLowerCase().includes(searchInput.toLowerCase()) ||
              handleFieldsSearch(data, searchInput)
            )) {
              return data;
            }
          });
        }
      }

      newQuestionFilter.count = filteredBySearch?.length || 0;
      newQuestionFilter.inactiveColor = questionFilter.isComplete ? '' : ''
      newQuestionFilter.activeColor = questionFilter.isComplete ? '' : ''
      newQuestionFilter.key = `${newQuestionFilter.status}/${newQuestionFilter.label}`;
      newQuestionFilter.total = filtered?.length;
      return newQuestionFilter;
    });
    return newQuestionFilters;
  };