use anchor_lang::prelude::*;

declare_id!("3F3NCBrANtBheTMke7HxVxtd12EGKYMAGK3ARo1NXS2C");

#[program]
pub mod voting_program {
    use anchor_lang::context;

    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>,poll_id:u64,
                            desription:String,poll_start:u64,poll_end:u64) -> Result<()> { 
            let poll=&mut ctx.accounts.poll;
            poll.poll_id=poll_id;
            poll.description=desription;
            poll.poll_start=poll_start;
            poll.poll_end=poll_end;
            poll.candidate_amount=0;
        Ok(())
    }

    pub fn initialize_candidate(ctx:Context<InitializeCandidates>,
                            candidate_name:String,_poll_id:u64)->Result<()>{

        let candidate_acc=&mut ctx.accounts.candidate_account;
        let poll_acc=&mut ctx.accounts.poll;
        poll_acc.candidate_amount+=1;
        candidate_acc.candidate_name=candidate_name;
        candidate_acc.candidate_vote=0;  
        Ok(())
    }

    pub fn vote(ctx:Context<Vote>,_candidate_name:String,_poll_id:u64)->Result<()>{
        let candidate=&mut ctx.accounts.candidate_account;
        candidate.candidate_vote+=1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id:u64)]
pub struct InitializePoll<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        init,
        payer=signer,
        space=8+Poll::INIT_SPACE,
        seeds=[b"poll".as_ref(),poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll:Account<'info,Poll>,
    pub system_program:Program<'info,System>
}


#[derive(Accounts)]
#[instruction(candidate_name:String,poll_id:u64)]
pub struct InitializeCandidates<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
     #[account(
        mut,
        seeds=[b"poll".as_ref(),poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll:Account<'info,Poll>,
    #[account(
        init,
        payer=signer,
        space=8+CandidateAccount::INIT_SPACE,
        seeds=[candidate_name.as_bytes(),poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub candidate_account:Account<'info,CandidateAccount>,
    pub system_program:Program<'info,System>
}


#[derive(Accounts)]
#[instruction(candidate_name:String,poll_id:u64)]
pub struct Vote<'info>{
   
    pub signer:Signer<'info>,
     #[account(
        mut,
        seeds=[b"poll".as_ref(),poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll:Account<'info,Poll>,
    #[account(
        mut,
        seeds=[candidate_name.as_bytes(),poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub candidate_account:Account<'info,CandidateAccount>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll{
    pub poll_id:u64,
    #[max_len(50)]
    pub description:String,
    pub poll_start:u64,
    pub poll_end:u64,
    pub candidate_amount:u64
}


#[account]
#[derive(InitSpace)]
pub struct CandidateAccount{
    #[max_len(50)]
    pub candidate_name:String,
    pub candidate_vote:u64
}