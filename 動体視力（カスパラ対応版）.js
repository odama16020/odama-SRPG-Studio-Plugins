/********************************************************************************
�����p�K��
�����Ƃ���SRPG Studio�����̋K���K������Ă��������B

�E���p���p�n�j�i����ȕ������p�Ŏg���l������̂�������܂��񂪁j
�E���ςn�j�i�ނ���X�N���v�g�ɏڂ������Ɏ蒼�����Ă���������Ƃ��肪�����ł��j
�E�Ĕz�z�n�j�i�������K�������Ŕz�z���Ă��������j
�E�g�p���̕񍐋y��readme�Ȃǂւ̋L�ڕs�v�i�L�ڂ��Ă���������ꍇ�̓X�P���g���̐l�Ə����Ă����Ă��������j
�Ewiki�f�ڂn�j

���̑��������O�҂̕��̂����f�ɂȂ�悤�Ȏg�p�͂��T�����������B
����ɂ���ĕs�s���������Ă��A���͈�ؐӔC�𕉂��܂���B

********************************************************************************
�X�L���u���̎��́v�i��ҁF�X�P���g���̐l�j
���J���F2016/05/14
�Ή�ver�F1.077
�x�[�X�F����singleton-calculator��HitCalculator����calculateAvoid�𔲂��o������
�@�@�@�i1-239���̓���Calculator�A���̖��莁��throw-master���Q�l�j

���p���@�FPlugin�t�H���_�ɕ��荞���
�f�[�^�ݒ�ŃX�L�����쐬���X�L����ނ��J�X�^���ɐݒ聨�L�[���[�h��dynamic-vision�Ɠ���
�X�L���̃J�X�^���p�����[�^��{exAvoid:xxx}���w�肵�܂��B�ixxx�͐����j

�����F
�E����ɊԐڍU�����d�|����ꂽ���A�J�X�p����exAvoid�ɐݒ肵��xxx�̒l�̕��A��𗦏㏸
�@�����l��ݒ肵�Ă��Ȃ��ꍇ��0�Ƃ݂Ȃ���܂��B���̒l���ꉞ�ݒ�\�ł��i��𗦂��������܂��j�B

���{�̂�ver�A�b�v�ɂ���āA�{�X�N���v�g���g�p�ł��Ȃ��Ȃ�\�������鎖����������������

�ύX����
���J�� �F2018/07/19
�Ή�ver�F1.189
         �C�x���g�R�}���h�u�_���[�W��^����v�Ŗ�������ݒ肷��ƃG���[��������o�O���C���i�C���F���O����j

���J�� �F2022/05/20
����m�Fver�F1.259
         ��𗦂��J�X�p���Őݒ�ł���悤���ρi���ώҁF�������܁j

********************************************************************************/
(function(){

	var alias1 = HitCalculator.calculateAvoid;
	HitCalculator.calculateAvoid = function(active, passive, weapon, totalStatus) {
		var avo = alias1.call(this, active, passive, weapon, totalStatus);
		var skill = SkillControl.getPossessionCustomSkill(passive,'dynamic-vision');
	
		// �J�X�p���ɐݒ肵��exAvoid�̒l���擾
		var exAvoid = 0;
		if (skill && typeof skill.custom.exAvoid === 'number') {
			exAvoid = parseInt(skill.custom.exAvoid);
		}
	
		var turnType = root.getCurrentSession().getTurnType();
	
		var direction;
		var isDirectAttack;
	
		if(active && turnType == active.getUnitType()){
			if(skill){
				direction = PosChecker.getSideDirection(active.getMapX(), active.getMapY(), passive.getMapX(), passive.getMapY());
				isDirectAttack = direction !== DirectionType.NULL;
				if( isDirectAttack === false ) {
					// �ԐڍU�����d�|����ꂽ���AexAvoid�̒l�̕��A��𗦏㏸
					avo += exAvoid;
				}
			}
		}
	
		return avo;
	}

})();