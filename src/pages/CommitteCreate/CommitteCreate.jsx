import { useEffect } from 'react';
import './CommitteCreate.css';
import { useState } from 'react';
import { getCommitteeList } from '../../services/committee.services';
import { PageListCommittee } from '../../components/CommitteeComponents/PageListCommittee';
import { getStates } from '../../services/estados.services';
import { CreateCommittee } from '../../components/CommitteeComponents/CreateCommittee';

const CommitteCreate = ({ }) => {

	return (
	<div className='committeeList'>
	
		<CreateCommittee
		/>
	</div>
	);
};

export default CommitteCreate;